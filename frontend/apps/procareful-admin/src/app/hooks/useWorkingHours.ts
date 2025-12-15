import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import type { SelectProps } from 'antd';
import type { FormattedWorkingDaysWithHours, WorkingDaysWithHours } from '@ProcarefulAdmin/typings';
import { type DayDtoName } from '@Procareful/common/api';

type RangeValue = [Dayjs | null, Dayjs | null] | null;

export const useHandleWorkingDays = (workingDaysData?: Partial<FormattedWorkingDaysWithHours>) => {
  const [pickedDays, setPickedDays] = useState<Partial<FormattedWorkingDaysWithHours> | undefined>({
    ...workingDaysData,
  });
  const handleSelectChange: SelectProps['onSelect'] = value => {
    setPickedDays(prevState => ({ ...prevState, [value]: [undefined, undefined] }));
  };

  const handleDeselectChange: SelectProps['onDeselect'] = (value: keyof WorkingDaysWithHours) => {
    setPickedDays(prevState => {
      const updatedDays = { ...prevState };
      delete updatedDays[value];

      return updatedDays;
    });
  };

  const handleRangePickerChange = (dates: RangeValue, weekDay: DayDtoName) => {
    // Reset state when "x" is clicked
    if (!dates) {
      setPickedDays({ ...pickedDays, [weekDay]: [undefined, undefined] });

      return;
    }

    const [start, end] = dates;

    if (!start || !end) {
      return;
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const startTime = dayjs.utc(start).tz(userTimezone);
    const endTime = dayjs.utc(end).tz(userTimezone);

    setPickedDays(prevState => ({ ...prevState, [weekDay]: [startTime, endTime] }));
  };

  const resetToInitialState = () => {
    setPickedDays(workingDaysData);
  };

  useDeepCompareEffect(() => {
    setPickedDays(workingDaysData);
  }, [workingDaysData]);

  return {
    pickedDays,
    handleSelectChange,
    handleDeselectChange,
    resetToInitialState,
    handleRangePickerChange,
  };
};
