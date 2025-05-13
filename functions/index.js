const functions = require("firebase-functions");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

// Retrieve Gmail credentials from functions config
//.condfig is marked deprecated but still works.
const gmailConfig = functions.config().gmail;

const oAuth2Client = new google.auth.OAuth2(
  gmailConfig.client_id,
  gmailConfig.client_secret,
  "https://developers.google.com/oauthplayground" // This must match the one used to get your refresh token
);

oAuth2Client.setCredentials({
  refresh_token: gmailConfig.refresh_token,
});

// Main email-sending function
exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Missing fields");
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: gmailConfig.user,
        clientId: gmailConfig.client_id,
        clientSecret: gmailConfig.client_secret,
        refreshToken: gmailConfig.refresh_token,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: gmailConfig.user,
      subject: "New Contact Form Submission",
      text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).send("Internal Server Error");
  }
});
