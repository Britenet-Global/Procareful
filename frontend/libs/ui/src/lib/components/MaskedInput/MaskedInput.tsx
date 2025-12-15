import { forwardRef, type ChangeEvent, type ForwardedRef } from 'react';
import { Input, type InputProps, type InputRef } from 'antd';

export type MaskedInputProps = Omit<InputProps, 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maskFunction: (inputValue: string) => string;
};

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ value = '', onChange, placeholder, maskFunction, ...otherProps }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const maskedValue = maskFunction(e.target.value);

      if (onChange) {
        onChange(maskedValue);
      }
    };

    return (
      <Input
        ref={ref as ForwardedRef<InputRef>}
        value={maskFunction(value)}
        onChange={handleChange}
        placeholder={placeholder}
        {...otherProps}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';
