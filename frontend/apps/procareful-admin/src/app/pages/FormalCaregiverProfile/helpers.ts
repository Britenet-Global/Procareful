import dayjs from 'dayjs';
import { TimeFormat } from '@Procareful/common/lib';

export const formatTimeRange = (start: string, end: string) => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);

  return `${startTime.format(TimeFormat.H_mm)} - ${endTime.format(TimeFormat.H_mm)}`;
};
