import { decrypt } from '../UTILS/decrypt.js';
import { google } from 'googleapis';
import { createEventObject } from '../UTILS/createEventObject.js';
import admin from 'firebase-admin';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../FIREBASE_ENV/env.js';

export const manageCalendar = async (req, res) => {
  try {
    const { id, ...eventDetails } = req.body;
    const userDoc = await admin.firestore().collection('USERS').doc(id).get();
    if (!userDoc.exists) throw new Error('Instructor no encontrado');

    const encryptedToken = userDoc.data().gg;
    const rol = userDoc.data().r;
    if (!encryptedToken) return res.status(401).json({error:'Instructor no vinculado a Google Calendar'});

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET
    );

    const refreshToken = decrypt(encryptedToken);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = createEventObject(eventDetails);

    if (rol === 'instructor') {
      const eventStart = event.start.dateTime
      const eventEnd = event.end.dateTime
      
      const freebusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: eventStart,
          timeMax: eventEnd,
          items: [{ id: 'primary' }],
        }
      });
      
      const busyTimes = freebusyResponse.data.calendars.primary.busy;
      if (busyTimes && busyTimes.length > 0) {
        return res.status(409).json({ error: 'La hora ya está ocupada' });
      }
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event
    });

    res.status(200).json({ eventId: response.data.id });
  } catch (error) {
    console.error('Error en manageCalendar:', error);

    if (error.message.includes('invalid_grant') && id) {
      await admin.firestore().collection('USERS').doc(id).update({
        gt: null
      });
      res.status(401).json({ error: 'Reautenticación requerida' });
    } else {
      res.status(500).json({ error: 'Error al crear evento', details: error.message });
    }
  }
};

export const deleteCalendarEvent = async (req, res) => {
  try {
    const { id, eventId } = req.body;
    if (!id || !eventId) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const userDoc = await admin.firestore().collection('USERS').doc(id).get();

    const encryptedToken = userDoc.data().gt;
    if (!encryptedToken) throw new Error('Instructor no vinculado a Google Calendar');

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET
    );

    const refreshToken = decrypt(encryptedToken);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: decrypt(eventId),
    });

    res.status(200).json({ message: 'Evento eliminado del calendario' });
  } catch (error) {
    console.error('Error en deleteCalendarEvent:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCalendarEvent = async (req, res) => {
  try {
    const { id,description, eventId, date, time, duration } = req.body;
    if (!id || !eventId || !date || !time) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const userDoc = await admin.firestore().collection('USERS').doc(id).get();
    const encryptedToken = userDoc.data().gt;
    if (!encryptedToken) throw new Error('Instructor no vinculado a Google Calendar');

    const country = "Ecuador";

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET
    );

    const refreshToken = decrypt(encryptedToken);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const decryptedEventId = decrypt(eventId);

    const updatedEvent = createEventObject({
      summary: 'Reserva actualizada',
      description,
      date,
      time,
      duration,
      country
    });

    await google.calendar({ version: 'v3', auth: oauth2Client }).events.update({
      calendarId: 'primary',
      eventId: decryptedEventId,
      requestBody: updatedEvent
    });

    res.status(200).json({ message: 'Evento actualizado del calendario' });
  } catch (error) {
    console.error('Error en updateCalendarEvent:', error);
    res.status(500).json({ error: error.message });
  }
};