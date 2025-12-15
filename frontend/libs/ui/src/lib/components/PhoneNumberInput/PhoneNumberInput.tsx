import { type ForwardRefRenderFunction, forwardRef, useEffect, useState } from 'react';
import { type ControllerRenderProps } from 'react-hook-form';
import { type InputProps, Select } from 'antd';
import { formatEuropeanPhoneNumber } from '@Procareful/common/lib';
import { INPUT_PLACEHOLDERS } from '@Procareful/common/lib/constants/enums';
import { MaskedInput } from '../MaskedInput';
import { splitPhoneNumber } from './helpers';
import { useStyles } from './styles';

type PhoneNumberInputProps = Omit<Partial<ControllerRenderProps>, 'value'> &
  InputProps & {
    value?: string;
    isOptional?: boolean;
  };

const DEFAULT_COUNTRY_CODE = '+48';
const countryCodesEnv = (import.meta.env.VITE_CELLPHONES_PREFIXES as string) ?? '';
const countryCodes = countryCodesEnv.split(', ');
const safeCountryCodes: string[] = Array.isArray(countryCodes) ? countryCodes : [];

const PhoneNumberMaskedInput: ForwardRefRenderFunction<HTMLInputElement, PhoneNumberInputProps> = (
  {
    onChange,
    value = '',
    isOptional = false,
    name,
    disabled,
    className,
    ...otherProps
  }: PhoneNumberInputProps,
  ref
) => {
  const { styles, cx } = useStyles();
  const [selectedPrefix, setSelectedPrefix] = useState(DEFAULT_COUNTRY_CODE);
  const [selectedLocalNumber, setSelectedLocalNumber] = useState('');

  const handleInputChange = (newLocalNumber: string) => {
    if (!newLocalNumber.length && isOptional) {
      return onChange?.('');
    }

    setSelectedLocalNumber(newLocalNumber);
    const newValue = `${selectedPrefix}-${newLocalNumber.replace(/ /g, '')}`;
    onChange?.(newValue);
  };

  const handleSelectChange = (newCountryCode: string) => {
    setSelectedPrefix(newCountryCode);
    const newValue = `${newCountryCode}-${selectedLocalNumber.replace(/ /g, '')}`;
    onChange?.(newValue);
  };

  useEffect(() => {
    const { countryCode: updatedCountryCode, localNumber: updatedLocalNumber } =
      splitPhoneNumber(value);

    setSelectedPrefix(updatedCountryCode || DEFAULT_COUNTRY_CODE);
    setSelectedLocalNumber(updatedLocalNumber || '');
  }, [value]);

  return (
    <MaskedInput
      {...otherProps}
      ref={ref}
      maskFunction={val => formatEuropeanPhoneNumber(val, selectedPrefix)}
      onChange={handleInputChange}
      value={selectedLocalNumber}
      name={name}
      className={cx(styles.container, className)}
      placeholder={disabled ? '' : INPUT_PLACEHOLDERS.PHONE_NUMBER}
      disabled={disabled}
      addonBefore={
        <Select
          onChange={handleSelectChange}
          defaultValue={DEFAULT_COUNTRY_CODE}
          value={selectedPrefix}
          disabled={disabled}
        >
          {safeCountryCodes.map((countryCode: string) => (
            <Select.Option key={countryCode} value={countryCode}>
              {countryCode}
            </Select.Option>
          ))}
        </Select>
      }
    />
  );
};

PhoneNumberMaskedInput.displayName = 'PhoneNumberMaskedInput';

const PhoneNumberInput = forwardRef(PhoneNumberMaskedInput);
export { PhoneNumberInput };
