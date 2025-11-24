import { GoogleAuth } from "google-auth-library";
import axios from "axios";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"]
});

const PROJECT_ID = "nefrovida-f25f3"; // Your Firebase project ID

export async function sendFirebaseMessage(deviceToken: string, payload: any) {
    console.log("📤 Sending Firebase message (HTTP v1)...");
    console.log(`   Device token: ${deviceToken.substring(0, 30)}...`);
    console.log(`   Title: ${payload.title}`);
    console.log(`   Body: ${payload.body}`);
    
    try {
        // Get OAuth 2.0 access token
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        
        if (!accessToken.token) {
            throw new Error("Failed to obtain access token");
        }
        
        console.log(`   ✓ Access token obtained: ${accessToken.token.substring(0, 20)}...`);
        
        const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;
        
        // HTTP v1 payload structure
        const v1Payload = {
            message: {
                token: deviceToken,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                // Optional: add custom data
                data: payload.data || {}
            }
        };
        
        const response = await axios.post(url, v1Payload, {
            headers: {
                "Authorization": `Bearer ${accessToken.token}`,
                "Content-Type": "application/json"
            }
        });
        
        console.log("✅ Firebase message sent successfully!");
        console.log(`   Response:`, response.data);
        
        return response;
    } catch (error: any) {
        console.error("❌ Firebase message failed!");
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, error.response.data);
        } else {
            console.error(`   Error:`, error.message);
        }
        throw error;
    }
}