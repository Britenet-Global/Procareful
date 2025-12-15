import { Button } from 'antd';
import { selectProperKeyboard } from '../../helpers';
import { useStyles } from './styles';

type KeyboardProps = {
  activeLetter: string[];
  inactiveLetter: string[];
  addGuessLetter: (letter: string) => void;
  currentLanguage: string;
  disabled: boolean;
};

const Keyboard = ({
  activeLetter,
  inactiveLetter,
  addGuessLetter,
  currentLanguage,
  disabled = false,
}: KeyboardProps) => {
  const properKeyboardArray = selectProperKeyboard(currentLanguage);
  const { styles } = useStyles();

  return (
    <div className={styles.keyboardContainer}>
      {properKeyboardArray.map((key: string) => {
        const isActive = activeLetter.includes(key.toLowerCase());
        const isInactive = inactiveLetter.includes(key.toLowerCase());

        return (
          <Button
            onClick={() => addGuessLetter(key.toLowerCase())}
            className={`
              ${styles.btn}
              ${isActive ? styles.activeBtn : ''}
              ${isInactive ? styles.inactiveBtn : ''}
            `}
            key={key}
            disabled={disabled || isInactive}
          >
            {key}
          </Button>
        );
      })}
    </div>
  );
};

export default Keyboard;
