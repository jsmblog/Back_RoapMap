import { DateTime } from 'luxon';
import { countryTimeZone } from './countryTimeZone.js';


export const createEventObject = ({ summary, description = '', eventDate, duration, country = "Ecuador" }) => {
  const timeZone = countryTimeZone[country] || 'UTC';

  const startDateTime = DateTime.fromISO(eventDate).setZone(timeZone, { keepLocalTime: true });
  const endDateTime = startDateTime.plus({ minutes: duration });

  return {
    summary,
    description,
    start: {
      dateTime: startDateTime.toISO(),
      timeZone,
    },
    end: {
      dateTime: endDateTime.toISO(),
      timeZone,
    },
  };
};