import { type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import type { ErrorResponse } from '@Procareful/common/api';
import { toCamelCase } from '@Procareful/common/lib';

export const setBackendFieldErrors = <T extends FieldValues>(
  errorResponse: ErrorResponse,
  setError: UseFormSetError<T>
) => {
  const details = errorResponse.response?.data?.details;

  if (!details) {
    return;
  }

  Object.entries(details).forEach(([fieldName, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      const message = messages[0];
      const camelCaseFieldName = toCamelCase(fieldName);

      setError(camelCaseFieldName as Path<T>, { type: 'backend', message });
    }
  });
};
