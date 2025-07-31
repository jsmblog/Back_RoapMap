import express from 'express';
import { handleOAuthCallback, startOAuth, unlinkGoogleCalendar } from '../CONTROLLER/oauth.js';
import { deleteCalendarEvent, manageCalendar, updateCalendarEvent } from '../CONTROLLER/manageCalendar.js';
const router = express.Router();

router.get('/start-oauth', startOAuth);
router.get("/oauth-callback",handleOAuthCallback);
router.post('/manage-calendar', manageCalendar);
router.post('/deleteCalendarEvent', deleteCalendarEvent);
router.put('/updateCalendarEvent',updateCalendarEvent);
router.post('/unlink-oauth', unlinkGoogleCalendar);
export default router;