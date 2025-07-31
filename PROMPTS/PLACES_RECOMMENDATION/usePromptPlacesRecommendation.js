export const usePromptPlacesRecommendation = ({ places, preferences }) => {
  return `
Datos disponibles:
Lugares:
${JSON.stringify(places)}
Preferencias:
${JSON.stringify(preferences)}

Analiza y devuelve UN JSON CRUDO con:
{"recommendations":SavedPlace[]}

Recuerda:
- Solo lugares con reseñas ≥ 4.
`;
};
