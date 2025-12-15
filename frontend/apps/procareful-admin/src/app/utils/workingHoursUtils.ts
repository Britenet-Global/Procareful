import dayjs from 'dayjs';
import { USER_TIMEZONE } from '@ProcarefulAdmin/constants';
import { WEEKDAYS_ORDER } from '@ProcarefulAdmin/constants/workingHours';
import type { FormattedWorkingDaysWithHours } from '@ProcarefulAdmin/typings';
import type { DayDto, DayDtoName } from '@Procareful/common/api';

export const sortWorkingDays = (
  workingDays?: Partial<FormattedWorkingDaysWithHours>
): DayDtoName[] => {
  if (!workingDays) {
    return [];
  }

  const weekdays = Object.keys(workingDays) as DayDtoName[];

  return weekdays.sort((a, b) => WEEKDAYS_ORDER.indexOf(a) - WEEKDAYS_ORDER.indexOf(b));
};

export const formatWorkingDays = (
  workingDaysData?: DayDto[]
): Partial<FormattedWorkingDaysWithHours> => {
  if (!workingDaysData) {
    return {};
  }

  // Process workingDaysData to convert string times to Day.js objects
  const formattedWorkingDays = workingDaysData.reduce<Partial<FormattedWorkingDaysWithHours>>(
    (acc, { name, start, end }) => {
      const startTime = dayjs.utc(start).tz(USER_TIMEZONE);
      const endTime = dayjs.utc(end).tz(USER_TIMEZONE);

      const formattedTime = [startTime, endTime];

      return { ...acc, [name]: formattedTime };
    },
    {}
  );

  return formattedWorkingDays;
};

export const transformPickedDays = (pickedDays: Partial<FormattedWorkingDaysWithHours>) => {
  const weekdays = Object.keys(pickedDays) as DayDtoName[];

  return weekdays.flatMap(weekDay => {
    const timeRange = pickedDays[weekDay];

    if (!timeRange || !timeRange[0] || !timeRange[1]) {
      return [];
    }

    const [startDate, endDate] = timeRange;

    return [
      {
        name: weekDay,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    ];
  });
};
