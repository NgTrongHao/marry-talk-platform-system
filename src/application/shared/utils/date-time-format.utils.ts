import { format } from 'date-fns';

const COMPAT_DATE_TIME_FORMAT = 'yyyyMMddHHmmss';

export const formatDateTimeToCompatFormat = (date: Date): string => {
  return format(date, COMPAT_DATE_TIME_FORMAT);
};
