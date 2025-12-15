import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormItem, type FormItemProps } from 'react-hook-form-antd';
import { Checkbox } from 'antd';
import type { CheckboxOptionType } from 'antd/lib';
import type { CheckboxGroupProps } from 'antd/lib/checkbox';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import { useStyles } from './styles';

type CheckboxGroupItemProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options: (CheckboxOptionType & { isRecommended?: boolean })[];
  control: Control<T>;
  hasFeedback?: FormItemProps['hasFeedback'];
  className?: string;
  containerClassName?: string;
} & CheckboxGroupProps;

const CheckboxGroupItem = <T extends FieldValues>({
  options,
  name,
  label,
  control,
  hasFeedback = true,
  className,
  containerClassName,
  ...checkboxProps
}: CheckboxGroupItemProps<T>) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  const handleRenderCheckboxGroup = () => {
    const hasRecommendation = options.some(option => 'isRecommended' in option);

    if (hasRecommendation) {
      return (
        <Checkbox.Group {...checkboxProps}>
          {options.map(({ value, label, isRecommended }, index) => (
            // TODO: for some reason value is any
            // eslint-disable-next-line
            <Checkbox key={index} value={value}>
              <Text>{label}</Text>
              {isRecommended && (
                <Tag customColor="teal" className={styles.marginLeft}>
                  {t('admin_inf_recommended')}
                </Tag>
              )}
            </Checkbox>
          ))}
        </Checkbox.Group>
      );
    }

    return <Checkbox.Group options={options} {...checkboxProps} />;
  };

  return (
    <div className={cx(styles.container, containerClassName)}>
      <FormItem
        name={name}
        label={label}
        control={control}
        className={cx(styles.checkboxGroupContainer, className)}
        hasFeedback={hasFeedback}
        valuePropName="checked"
      >
        {handleRenderCheckboxGroup()}
      </FormItem>
    </div>
  );
};

export default CheckboxGroupItem;
