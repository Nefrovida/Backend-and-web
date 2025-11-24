import { GoogleAuth } from "google-auth-library";
import axios from "axios";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"]
});

const PROJECT_ID = "nefrovida-f25f3"; // Your Firebase project ID

export async function sendFirebaseMessage(deviceToken: string, payload: any) {
    try {
        // Get OAuth 2.0 access token
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        
        if (!accessToken.token) {
            throw new Error("Failed to obtain access token");
        }
                
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