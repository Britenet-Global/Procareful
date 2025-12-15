import { type FunctionComponent, type SVGProps, type ChangeEventHandler } from 'react';
import { useStyles } from './styles';

type RadioOption<T> = {
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  value: T;
  id: number;
};

type ChallengeRatingRadioButtonProps<T extends string | number> = {
  label: string;
  value?: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

const ChallengeRatingRadioButton = <T extends string | number>({
  label,
  value: selectedValue,
  options,
  onChange,
  className,
}: ChallengeRatingRadioButtonProps<T>) => {
  const { styles, cx } = useStyles();

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.target.value as unknown as T;
    onChange(value);
  };

  return (
    <div className={cx(styles.container, className)}>
      <label className={styles.inputLabel}>{label}</label>
      <div className={styles.radioButtonContainer}>
        {options.map(({ icon: Icon, value, id }) => (
          <label key={id} className={styles.radioButton}>
            <input
              type="radio"
              value={value}
              checked={value === selectedValue}
              onChange={handleChange}
            />
            <Icon className={cx({ [styles.radioButtonSelected]: value === selectedValue })} />
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChallengeRatingRadioButton;
