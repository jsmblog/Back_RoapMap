export const usePromptClimateRecommendation = (data_to_analyze) => {
  const {
    name: location = 'tu localidad',
    sys: { country = '', sunrise = 0, sunset = 0 } = {},
    main: {
      temp = 0,
      feels_like = 0,
      temp_min = 0,
      temp_max = 0,
      pressure = 0,
      humidity = 0
    } = {},
    weather: [{ main: condition = 'Desconocido', description = '' } = {}] = [],
    wind: { speed: wind_speed = 0, deg: wind_direction = 0 } = {},
    clouds: { all: cloudiness = 0 } = {},
    visibility = 0,
    dt = 0,
    timezone = 0
  } = data_to_analyze;

 const localTimestamp = (dt + timezone) * 1000;
  const isDay = dt >= sunrise && dt < sunset;
  const momento = isDay ? 'día' : 'noche';
  const horaLocal = new Date(localTimestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });


  return `
Te comparto el panorama meteorológico para ${location}, ${country},  a las ${horaLocal} (hora local). Es de ${momento}, así que adapta las recomendaciones al momento del día.

• La temperatura ronda los ${Math.round(temp - 273.15)}°C y se siente como ${Math.round(feels_like - 273.15)}°C.
• Mínima ${Math.round(temp_min - 273.15)}°C, máxima ${Math.round(temp_max - 273.15)}°C.
• Cielo con ${condition}${description ? ` (${description})` : ''} y ${cloudiness}% de nubosidad.
• Humedad al ${humidity}%, presión ${pressure} hPa y viento suave de ${wind_speed} m/s.
• Visibilidad de ${visibility} metros.

Con esta información, redacta un texto fluido y cercano que sugiera de manera natural:
- Qué ropa llevar puesta.
- Cómo aprovechar al máximo el día.
- Qué precauciones tener, especialmente si piensas salir al aire libre.

No uses listas numeradas ni encabezados; habla como si le contaras a un amigo y mantén un tono motivador.
`;
};
