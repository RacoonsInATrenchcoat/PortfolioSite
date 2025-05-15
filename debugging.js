const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = 'tabitamas91@gmail.com'; // Ensure this is correct

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function verifyTokenIdentity() {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log("✅ Authenticated as:", profile.data.emailAddress);
  } catch (error) {
    console.error("❌ Failed to retrieve Gmail profile:", error.message);
  }
}

async function getAccessToken() {
  const { token } = await oauth2Client.getAccessToken();
  return token;
}

async function sendTestEmail() {
  const accessToken = await getAccessToken();
  await verifyTokenIdentity(); // ✅ Call it inside the async scope

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  const mailOptions = {
    from: `Portfolio Contact <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: 'Test Email from Node.js',
    text: 'This is a test email.',
    html: '<b>This is a test email.</b>'
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.response);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
}

sendTestEmail(); // entry point
