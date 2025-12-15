import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormItem, type FormItemProps } from 'react-hook-form-antd';
import { type CheckboxOptionType, Radio, type RadioGroupProps } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import { useStyles } from './styles';

type RadioGroupItemProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options: (CheckboxOptionType & { description?: string; isRecommended?: boolean })[];
  control: Control<T>;
  hasFeedback?: FormItemProps['hasFeedback'];
  className?: string;
} & RadioGroupProps;

const RadioGroupItem = <T extends FieldValues>({
  options,
  name,
  label,
  control,
  hasFeedback = true,
  className,
  ...radioProps
}: RadioGroupItemProps<T>) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  const handleRenderRadioGroup = () => {
    const hasDescription = options.some(option => 'description' in option);
    const hasDescriptionPosition = options.some(option => 'descriptionPosition' in option);

    if (hasDescription && hasDescriptionPosition) {
      return (
        <Radio.Group {...radioProps}>
          {options.map(({ value, label, description }, index) => (
            <div className={styles.columnContainer} key={index}>
              <Radio value={value as unknown as T} className={styles.decreasedMargin}>
                <Text>{label}</Text>
              </Radio>
              <Text className={styles.radioBottomDescription}>{description}</Text>
            </div>
          ))}
        </Radio.Group>
      );
    }

    if (hasDescription) {
      return (
        <Radio.Group {...radioProps}>
          {options.map(({ value, label, description, isRecommended }, index) => (
            <Radio key={index} value={value as unknown as T}>
              <Text>{label}</Text>
              <Text className={styles.radioDescription}>{description}</Text>
              {isRecommended && (
                <Tag customColor="teal" className={styles.marginLeft}>
                  {t('admin_inf_recommended')}
                </Tag>
              )}
            </Radio>
          ))}
        </Radio.Group>
      );
    }

    return <Radio.Group options={options} {...radioProps} />;
  };

  return (
    <div className={styles.container}>
      <FormItem
        name={name}
        label={label}
        control={control}
        className={cx(styles.radioGroupContainer, className)}
        hasFeedback={hasFeedback}
      >
        {handleRenderRadioGroup()}
      </FormItem>
    </div>
  );
};

export default RadioGroupItem;
