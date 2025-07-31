export const usePromptRedactor = (data_to_analyze) => {
    const { name, formattedPrefs } = data_to_analyze;
    return `
Actúa como un experto en redacción creativa y personal branding. Tu tarea es crear una breve descripción tipo “About Me” para un usuario, adaptada a su personalidad, intereses y objetivos. 
- Nombre del usuario: ${name || 'N/A'}.
- Preferencias: ${formattedPrefs || 'sin preferencias'}.
El tono debe ser natural, auténtico y con impacto, ideal para un perfil profesional o red social.
`.trim()
}