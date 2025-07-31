import { encrypt } from '../UTILS/encrypt.js';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '../FIREBASE_ENV/env.js';

if (!admin.apps.length) {
  admin.initializeApp();
}

const globalOAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export const startOAuth = async (req, res) => {
  const { userId } = req.query;

  const authUrl = globalOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state: userId
  });

  res.redirect(authUrl);
};

export const handleOAuthCallback = async (req, res) => {
  try {
    const { code, state: userId } = req.query;
    const { tokens } = await globalOAuth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;

    await admin.firestore().collection('USERS').doc(userId).update({
      gt: encrypt(refreshToken)
    });

    res.redirect(`http://localhost:8100/${userId}/calendar-linked?success=true`);
  } catch (error) {
    console.error('Error en OAuth callback:', error);
    const userId = req.query.state || 'unknown';
    res.redirect(`http://localhost:8100/${userId}/calendar-linked?success=false`);
  }
};

export const unlinkGoogleCalendar = async (req, res) => {
  try {
    const { userId } = req.body; 
    if (!userId) {
      return res.status(400).json({ message: "ID de usuario no proporcionado" });
    }

    await admin.firestore().collection('USERS').doc(userId).update({
      gt: null
    });

    res.status(200).json({ message: "Google Calendar desvinculado exitosamente" });
  } catch (error) {
    console.error("Error al desvincular Google Calendar:", error);
    res.status(500).json({ message: "Error al desvincular Google Calendar" });
  }
};
