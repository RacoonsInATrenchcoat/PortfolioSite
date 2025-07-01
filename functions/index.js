// functions/index.js

// 1) Only import what Firebase needs to register the function
const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors");
const { defineSecret } = require("firebase-functions/params");

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
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { google } = require("googleapis");
    const { Buffer } = require("buffer"); // built-in

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send("Missing fields");
    }

    try {
      // a) Spin up OAuth2 client
      const oAuth2 = new google.auth.OAuth2(
        GMAIL_CLIENT_ID.value(),
        GMAIL_CLIENT_SECRET.value()
      );
      oAuth2.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN.value() });

      // b) Grab an access token
      const { token: accessToken } = await oAuth2.getAccessToken();

      // c) Build Gmail API
      const gmail = google.gmail({ version: "v1", auth: oAuth2 });

      // d) Construct the mail in raw RFC2822
      const raw = Buffer.from(
        `From: "${name}" <${GMAIL_USER.value()}>\r\n` +
        `Reply-To: ${email}\r\n` +
        `To: ${GMAIL_USER.value()}\r\n` +
        `Subject: New Contact from ${name}\r\n\r\n` +
        `${message}`
      ).toString("base64url");

      // e) Send via REST
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

//Used to ensure the refresh token does not invalide due to no useage.

exports.sendContactEmail = onRequest({
  region: "europe-west1",
  timeoutSeconds: 60,
  memory: "256MiB",
  secrets: [ /* your secret names */ ]
}, async (req, res) => {

  /* ────── KEEP‑ALIVE PING ────── */
  if (req.body && req.body.ping === true) {
    try {
      await oAuth2Client.getAccessToken();      // refreshes silently
      console.log("✅ token keep‑alive succeeded");
      return res.status(204).send();
    } catch (err) {
      console.error("❌ token keep‑alive failed", err.message);
      return res.status(500).send("token refresh failed");
    }
  }
  /* ─── continue with normal contact‑form logic below ─── */

  // ... existing validation, Gmail API send, etc.
});
