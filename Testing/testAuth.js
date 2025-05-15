const { google } = require('googleapis');

// Replace these with your actual values or use dotenv if preferred
const CLIENT_ID       = 'notforGithub'
const CLIENT_SECRET   = 'notforGithub'
const REFRESH_TOKEN   = 'notforGithub'
const GMAIL_USER      = 'notforGithub'
const REDIRECT_URI    = 'https://developers.google.com/oauthplayground';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// ✅ THIS IS CRUCIAL
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function testAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    console.log("✅ Access token retrieved successfully:");
    console.log(token);
  } catch (err) {
    console.error("❌ Failed to retrieve access token:");
    console.error(err);
  }
}

testAccessToken();
