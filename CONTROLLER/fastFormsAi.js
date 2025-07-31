import axios from 'axios';
import { API_KEY_DEEPSEEK } from "../FIREBASE_ENV/env.js";
import { buildAIRequestPayload } from '../UTILS/buildAiRequestPayload.js';

export const sendRequestToAI = async (req, res) => {
  const { mod, data_to_analyze } = req.body;
  if (!mod) {
    return res.status(400).json({ error: 'Se requiere un modo para ejecutar la IA' });
  }
  if (!data_to_analyze) {
    return res.status(400).json({ error: 'No se recibió información para analizar' });
  }

  try {
    const payload = buildAIRequestPayload(mod, data_to_analyze);
    console.log('📤 Payload enviado a DeepSeek:', JSON.stringify(payload, null, 2));

    const { data } = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY_DEEPSEEK}`,
          'Content-Type': 'application/json'
        },
      }
    );

    const message = data.choices?.[0]?.message?.content;
    return res.status(200).json({ message });

  } catch (err) {
    console.error('❌ Error en sendRequestToAI:', {
      status: err.response?.status,
      responseData: err.response?.data,
      message: err.message
    });

    const statusCode = err.response?.status || 500;
    const errorData = err.response?.data || { message: err.message };
    return res.status(statusCode).json({ error: errorData });
  }
};
