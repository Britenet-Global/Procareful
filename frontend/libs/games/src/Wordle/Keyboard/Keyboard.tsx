import { Button } from 'antd';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined';
import { keyboardLayouts } from '../constants';
import { useStyles } from './styles';

type KeyboardProps = {
  language: string;
  onKeyPress: (key: string) => void;
};

const Keyboard = ({ language, onKeyPress }: KeyboardProps) => {
  const { styles, cx } = useStyles();
  const layout = keyboardLayouts[language];
  const renderKeyboardKeyContent = (key: string) => {
    if (key === 'Enter') {
      return <ForwardOutlinedIcon className={styles.icon} />;
    }
    if (key === 'Backspace') {
      return <BackspaceOutlinedIcon className={styles.icon} />;
    }

    return key;
  };

  return (
    <div className={styles.keyboard}>
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.keyboardRow}>
          {row.map((key, keyIndex) => (
            <Button
              key={keyIndex}
              className={cx(styles.keyboardButton, {
                [styles.specialButton]: key === 'Enter' || key === 'Backspace',
              })}
              onClick={() => onKeyPress(key)}
              icon={renderKeyboardKeyContent(key)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
