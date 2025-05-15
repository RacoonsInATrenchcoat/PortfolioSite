// sendEmail.js
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// ─── CONFIGURE THESE VALUES ─────────────────────────────────────────────
// These must match exactly what you tested in testAuth.js:
const CLIENT_ID       = 'notforGithub'
const CLIENT_SECRET   = 'notforGithub'
const REFRESH_TOKEN   = 'notforGithub'
const GMAIL_USER      = 'notforGithub'
const REDIRECT_URI    = 'https://developers.google.com/oauthplayground';
// ────────────────────────────────────────────────────────────────────────

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendTestEmail() {
  try {
    // 1) Get a fresh access token
    const { token: accessToken } = await oauth2Client.getAccessToken();
    console.log('✅ Access token:', accessToken);

    // 2) Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type:         'OAuth2',
        user:         GMAIL_USER,
        clientId:     CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken, // the token we just fetched
      },
    });

    // 3) Define your test email
    const mailOptions = {
      from:    `Test Sender <${GMAIL_USER}>`,
      to:      GMAIL_USER,                      // send to yourself
      subject: '✔️ Nodemailer + OAuth2 Test',
      text:    'This is a test email sent via Nodemailer using Gmail OAuth2.',
      html:    `<p><strong>This is a test email</strong> sent via Nodemailer using Gmail OAuth2.</p>`
    };

    // 4) Send it
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', result.response);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}

// Run the test
sendTestEmail();
