import { Card } from 'antd';
import { GetGameDifficultyLevelsResponseDtoDetailsItem } from '@Procareful/common/api';
import { GameDisplayState } from '@Procareful/games';
import LogoSvg from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import type { CardData } from '../../typings';
import { useStyles } from './styles';

type TileProps = {
  difficultyLevel: GetGameDifficultyLevelsResponseDtoDetailsItem;
  onClick: (index: number) => void;
  result: Record<string, boolean>;
  card: CardData;
  index: number;
  gameDisplayState: GameDisplayState;
  isInactive: boolean;
  isFlipped: boolean;
  isDisabled: boolean;
};

const Tile = ({
  onClick,
  card,
  index,
  difficultyLevel,
  result,
  gameDisplayState,
  isInactive,
  isFlipped,
  isDisabled,
}: TileProps) => {
  const { styles, cx } = useStyles();
  const handleClick = () => {
    if (!isFlipped && !isDisabled) {
      onClick(index);
    }
  };

  const { image: FirstIcon, secondImage: SecondIcon, color } = card;

  const showSecondImage =
    difficultyLevel !==
    (GetGameDifficultyLevelsResponseDtoDetailsItem.NUMBER_1 ||
      GetGameDifficultyLevelsResponseDtoDetailsItem.NUMBER_2);

  const cardKey = `${card.type}_${card.color}`;
  const isColorDefault = color === 'default';
  const isColorHard = color === 'hard';
  const isValid = Object.keys(result).includes(cardKey);
  const isDiff = gameDisplayState === GameDisplayState.DIFF;

  return (
    <Card
      className={cx(styles.card, styles[difficultyLevel], {
        [styles.flipped]: isFlipped,
        [styles.inactive]: isInactive,
        [styles.showDiff]: isDiff,
        [styles.valid]: isDiff && isValid,
        [styles.invalid]: isDiff && !isValid,
      })}
      onClick={handleClick}
    >
      {!isFlipped && <LogoSvg className={styles.logoIcon} />}
      {isFlipped && (
        <div className={cx(styles.iconContainer, SecondIcon && styles.secondIcon)}>
          <FirstIcon
            className={cx(styles.iconToGuess, {
              [styles.defaultFirstGuessIcon]: isColorDefault,
              [styles.hardFirstGuessIcon]: isColorHard,
            })}
          />
          {showSecondImage && (
            <SecondIcon
              className={cx(styles.iconToGuess, {
                [styles.defaultSecondGuessIcon]: isColorDefault,
                [styles.hardSecondGuessIcon]: isColorHard,
              })}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default Tile;
