// functions/index.js

// 1) Only import what Firebase needs to register the function
const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors");
const { defineSecret } = require("firebase-functions/params");
const { google } = require("googleapis");
const { Buffer } = require("buffer");

// 2) Define your secrets (no heavy work here)
const GMAIL_USER          = defineSecret("GMAIL_USER");
const GMAIL_CLIENT_ID     = defineSecret("GMAIL_CLIENT_ID");
const GMAIL_CLIENT_SECRET = defineSecret("GMAIL_CLIENT_SECRET");
const GMAIL_REFRESH_TOKEN = defineSecret("GMAIL_REFRESH_TOKEN");

// 3) Prepare CORS middleware
const corsHandler = cors({ origin: true });

// 4) Export the function (VERY lightweight on module load)
exports.sendContactEmail = onRequest({
  region:       "europe-west1",
  timeoutSeconds: 60,
  memory:       "256MiB",
  secrets: [
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN
  ]
}, async (req, res) => {
  // 5) Defer all the heavy lifting until a request comes in:
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

corsHandler(req, res, async () => {

    // Handle keep-alive ping to refresh token
    if (req.body && req.body.ping === true) {
      try {
        const oAuth2Client = new google.auth.OAuth2(
          GMAIL_CLIENT_ID.value(),
          GMAIL_CLIENT_SECRET.value()
        );
        oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN.value() });

        await oAuth2Client.getAccessToken();  // silently refresh token
        console.log("✅ token keep-alive succeeded");
        return res.status(204).send();
      } catch (err) {
        console.error("❌ token keep-alive failed", err.message);
        return res.status(500).send("token refresh failed");
      }
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send("Missing fields");
    }

    try {
      const oAuth2 = new google.auth.OAuth2(
        GMAIL_CLIENT_ID.value(),
        GMAIL_CLIENT_SECRET.value()
      );
      oAuth2.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN.value() });

      await oAuth2.getAccessToken();

      const gmail = google.gmail({ version: "v1", auth: oAuth2 });

      const raw = Buffer.from(
        `From: "${name}" <${GMAIL_USER.value()}>\r\n` +
        `Reply-To: ${email}\r\n` +
        `To: ${GMAIL_USER.value()}\r\n` +
        `Subject: New Contact from ${name}\r\n\r\n` +
        `${message}`
      ).toString("base64url");

      await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw }
      });

      res.status(200).send("Email sent successfully.");
    } catch (err) {
      console.error("Gmail API error:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});
