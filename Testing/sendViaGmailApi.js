// sendViaGmailApi.js

// ─── CONFIGURE THESE ────────────────────────────────────────────────────────
// These should be the exact same values you hard-coded before:
const CLIENT_ID       = 'notforGithub'
const CLIENT_SECRET   = 'notforGithub'
const REFRESH_TOKEN   = 'notforGithub'
const GMAIL_USER      = 'notforGithub'
const REDIRECT_URI    = 'https://developers.google.com/oauthplayground';
// ────────────────────────────────────────────────────────────────────────────

const { google } = require('googleapis');

async function sendViaGmailAPI(subject, bodyText) {
  // 1) Set up OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // 2) Build the Gmail service
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // 3) Create the raw RFC 2822 email message
  const rawMessage = Buffer.from(
    `From: "${GMAIL_USER}" <${GMAIL_USER}>\r\n` +
    `To: ${GMAIL_USER}\r\n` +
    `Subject: ${subject}\r\n\r\n` +
    `${bodyText}`
  ).toString('base64url');  // URL-safe Base64 encoding

  // 4) Send the message
  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawMessage }
    });
    console.log('✅ Message sent via Gmail API, ID:', res.data.id);
  } catch (err) {
    console.error('❌ Gmail API send error:', err);
  }
}

// ─── Run a quick test ────────────────────────────────────────────────────────
sendViaGmailAPI(
  'Test via Gmail REST API',
  'Hello! This email was sent by the Gmail API using OAuth2 credentials.'
);
