import express from 'express';
import { sendRequestToAI } from '../CONTROLLER/fastFormsAi.js';

const router = express.Router();
router.post('/send/request/ai', sendRequestToAI);
export default router;
