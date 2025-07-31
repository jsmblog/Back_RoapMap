import { systemRedactor } from '../PROMPTS/REDACTOR/systemRedactor.js';
import { usePromptRedactor } from '../PROMPTS/REDACTOR/usePromptRedactor.js';
import { systemClimateRecommendation } from '../PROMPTS/CLIMATE_RECOMMENDATION/systemClimateRecommendation.js';
import { usePromptClimateRecommendation } from '../PROMPTS/CLIMATE_RECOMMENDATION/usePromptClimateRecommendation.js';
import { systemPlacesRecommendation } from '../PROMPTS/PLACES_RECOMMENDATION/systemPlacesRecommendation.js';
import { usePromptPlacesRecommendation } from '../PROMPTS/PLACES_RECOMMENDATION/usePromptPlacesRecommendation.js';

const MOD_HANDLERS = {
  redactor: {
    system: systemRedactor,
    user: usePromptRedactor,
  },
  climate_recommendation: {
    system: systemClimateRecommendation,
    user: usePromptClimateRecommendation,
  },
  places_recommendation: {
    system: systemPlacesRecommendation,
    user: usePromptPlacesRecommendation,
  },
};

export const buildAIRequestPayload = (mod, data_to_analyze) => {
  const normalizedMod = mod.toLowerCase();
  const handler = MOD_HANDLERS[normalizedMod];

  if (!handler) {
    throw new Error(`Modo desconocido: ${mod}`);
  }

  const systemPrompt = handler.system;
  const userPrompt = handler.user(data_to_analyze);

  return {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 1500,
    temperature: 0.3,
    top_p: 0.1,
  };
};
