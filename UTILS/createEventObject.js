import { DateTime } from 'luxon';
import { countryTimeZone } from './countryTimeZone.js';

export const createEventObject = ({summary,description = '',date,time,duration,country}) => {
  const timeZone = countryTimeZone[country] || 'UTC';
  const startDateTime = DateTime.fromFormat(`${date} ${time}`, 'yyyy-LL-dd HH:mm', { zone: timeZone });
  const endDateTime = startDateTime.plus({ minutes: duration });
  return {
    summary,
    description,
    start: {
      dateTime: startDateTime.toISO(), 
      timeZone
    },
    end: {
      dateTime: endDateTime.toISO(),
      timeZone
    }
  };
};
