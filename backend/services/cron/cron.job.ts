import cron from "node-cron";
import { prisma } from "../../src/util/prisma";
import { sendFirebaseMessage } from "../firebase/firebaseApi.service";
  
  cron.schedule("* * * * *", async () => {
  
    const now = new Date();
  
    try {
      const due = await prisma.notifications.findMany({
        where: {
          status: "PENDING",
          sendTime: { lte: now },
        },
      });
        
      if (due.length === 0) {
        return;
      }
  
      for (const notif of due) {
        try {          
          await sendFirebaseMessage(notif.device_token, {
            title: notif.title,
            body: notif.content,
          });
    
          await prisma.notifications.update({
            where: { id: notif.id },
            data: { status: "SENT", sent: new Date() },
          });
              
        } catch (err: any) {
          console.error(`   ❌ Error sending notification #${notif.id}:`, err.message);
        }
      }
      
      // console.log(`\n   ✓ Cron job completed. Processed ${due.length} notification(s)\n`);
    } catch (error: any) {
      console.error("   ❌ Error in cron job:", error.message);
    }
  });