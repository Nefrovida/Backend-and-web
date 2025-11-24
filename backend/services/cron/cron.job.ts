import cron from "node-cron";
import { prisma } from "../../src/util/prisma";
import { sendFirebaseMessage } from "../firebase/firebaseApi.service";

export const NotificationCron = {
  //   register: async (type: string, appointmentId: number) => {
  //     // Build datetime logic based on appointment
  //     const appointment = await prisma.appointments.findUnique({
  //       where: { appointment_id: appointmentId }
  //     });
  
  //     const notifyAt = new Date(appointment.datetime);
  //     notifyAt.setMinutes(notifyAt.getMinutes() - 15); // reminder 15 min before
  
  //     await prisma.notifications.create({
  //       data: {
  //         type,
  //         appointmentId,
  //         userId: appointment.userId,
  //         status: "PENDING",
  //         deliverAt: notifyAt,
  //       },
  //     });
  //   },
  // };
}
  
  cron.schedule("* * * * *", async () => {
    console.log("\n⏰ Running notification cron...");
    console.log(`   Current time: ${new Date().toLocaleTimeString()}`);
  
    const now = new Date();
  
    try {
      const due = await prisma.notifications.findMany({
        where: {
          status: "PENDING",
          sendTime: { lte: now },
        },
      });
  
      console.log(`   Found ${due.length} pending notification(s) ready to send`);
      
      if (due.length === 0) {
        console.log("   ✓ No notifications to send at this time");
        return;
      }
  
      for (const notif of due) {
        try {
          console.log(`\n   📨 Processing notification #${notif.id}`);
          console.log(`      User: ${notif.user_id}`);
          console.log(`      Title: ${notif.title}`);
          console.log(`      Send time: ${notif.sendTime.toLocaleTimeString()}`);
          
          await sendFirebaseMessage(notif.device_token, {
            title: notif.title,
            body: notif.content,
          });
    
          await prisma.notifications.update({
            where: { id: notif.id },
            data: { status: "SENT", sent: new Date() },
          });
          
          console.log(`   ✅ Notification #${notif.id} sent and marked as SENT`);
    
        } catch (err: any) {
          console.error(`   ❌ Error sending notification #${notif.id}:`, err.message);
        }
      }
      
      console.log(`\n   ✓ Cron job completed. Processed ${due.length} notification(s)\n`);
    } catch (error: any) {
      console.error("   ❌ Error in cron job:", error.message);
    }
  });