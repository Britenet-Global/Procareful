import { LocalStorageKey, SearchParams } from '@Procareful/common/lib/constants';

type UpdateSearchParams = {
  searchParams: URLSearchParams;
  stepNumber: number;
  personalGrowthId?: string;
};

export const getNewSearchParams = ({
  searchParams,
  stepNumber,
  personalGrowthId,
}: UpdateSearchParams): URLSearchParams => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set(SearchParams.Step, stepNumber.toString());
  personalGrowthId && newSearchParams.set(SearchParams.Id, personalGrowthId.toString());

  return newSearchParams;
};

export const removePersonalGrowthDataFromLocalStorage = () =>
  localStorage.removeItem(LocalStorageKey.PersonalGrowthData);
