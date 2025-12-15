import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { Text } from '@Procareful/ui';
import XBlock from '@Procareful/ui/assets/images/Snake/XBlock.svg?react';
import Snake from '@Procareful/ui/assets/images/Snake/snake.svg?react';
import {
  gameSpeed,
  blockPositions,
  blockWidth,
  heartsGif,
  pointsForEatenBlock,
  positions,
} from '../../constants';
import { useStyles } from './styles';

type BoardProps = {
  showTutorialModal: boolean;
  hearts: number;
  eatenBlock: number;
  eatenCombo: number;
  setEatenCombo: (eatenCombo: number) => void;
  setEatenBlock: (eatenBlock: number) => void;
  setHearts: (hearts: number) => void;
  setPoints: (points: number) => void;
  setEndGame: (endGame: boolean) => void;
  resetTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
};

const GameLogic = ({
  showTutorialModal,
  hearts,
  eatenBlock,
  eatenCombo,
  setEatenCombo,
  setEatenBlock,
  setHearts,
  setPoints,
  setEndGame,
  resetTimer,
  startTimer,
  stopTimer,
}: BoardProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const randomNumberToAdd = Math.floor(Math.random() * 4) + 1;
  const [snakePosition, setSnakePosition] = useState(positions.middleTrack);
  const [isCountingView, setIsCountingView] = useState(true);
  const [countdown, setCountdown] = useState(4);
  const [blockNumber, setBlockNumber] = useState(1);
  const [numberBlockPosition, setNumberBlockPosition] = useState<
    { position: string; id: number }[]
  >([]);
  const [xBlocksPositions, setXBlocksPositions] = useState<
    { position: string; id: number; isXBlock: boolean }[]
  >([]);
  const [isAnimation, setIsAnimation] = useState(true);
  const [hasEaten, setHasEaten] = useState(false);
  const [differentBlock, setDifferentBlock] = useState(2);

  const boardRef = useRef<HTMLDivElement>(null);

  const handleRightArrowClick = () => {
    if (snakePosition === positions.lastTrack) return;

    const targetPosition =
      {
        [positions.firstTrack]: positions.middleTrack,
        [positions.middleTrack]: positions.lastTrack,
      }[snakePosition] || positions.firstTrack;

    setSnakePosition(targetPosition);
  };

  const handleLeftArrowClick = () => {
    if (snakePosition === positions.firstTrack) return;

    const targetPosition =
      {
        [positions.middleTrack]: positions.firstTrack,
        [positions.lastTrack]: positions.middleTrack,
      }[snakePosition] || positions.lastTrack;

    setSnakePosition(targetPosition);
  };

  const generateNewBlock = () => {
    const newRandomPosition = blockPositions[Math.floor(Math.random() * blockPositions.length)];
    const isDisplayXBlock = Math.floor(Math.random() * 2);
    const newBlockNumber = eatenBlock + 1;

    const remainingPositions = blockPositions.filter(position => position !== newRandomPosition);
    const newXBlocks = remainingPositions.map((position, index) => ({
      position,
      id: newBlockNumber,
      isXBlock: isDisplayXBlock === 1 ? true : index !== isDisplayXBlock,
    }));

    setNumberBlockPosition([{ position: newRandomPosition, id: newBlockNumber }]);
    setXBlocksPositions(newXBlocks);
    setBlockNumber(blockNumber);
    setDifferentBlock(eatenBlock + randomNumberToAdd + 1);
  };

  const checkIfBlockEaten = (blockTop: number | string, blockId: number) => {
    if (showTutorialModal) return;
    const snakePositionValue = snakePosition.slice(5).split(' ')[0];
    if (
      boardRef.current?.clientHeight &&
      boardRef.current?.clientHeight - 0.25 * boardRef.current?.clientHeight <
        +blockTop + blockWidth &&
      boardRef.current?.clientHeight - 0.25 * boardRef.current?.clientHeight > +blockTop &&
      snakePositionValue === numberBlockPosition[0]?.position &&
      !hasEaten
    ) {
      setPoints(blockId * pointsForEatenBlock);
      setEatenBlock(eatenBlock + 1);
      setHasEaten(true);
    }
    if (
      boardRef.current?.clientHeight &&
      boardRef.current?.clientHeight - 0.25 * boardRef.current?.clientHeight <
        +blockTop + blockWidth &&
      boardRef.current?.clientHeight - 0.25 * boardRef.current?.clientHeight > +blockTop &&
      snakePositionValue !== numberBlockPosition[0]?.position
    ) {
      setIsAnimation(false);
      setCountdown(2);
    }
  };

  const handleAnimationComplete = () => {
    setNumberBlockPosition(prevBlocks => prevBlocks.filter(block => block.id !== eatenBlock + 1));
    setHasEaten(false);

    if (isAnimation) {
      setEatenCombo(eatenCombo + 1);
      generateNewBlock();
    } else {
      setBlockNumber(eatenBlock + 1);
      setEatenCombo(0);
      generateNewBlock();
    }
  };

  useEffect(() => {
    if (isCountingView) {
      const interval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          }
          setIsCountingView(false);

          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCountingView]);

  useEffect(() => {
    if (!isAnimation && !showTutorialModal) {
      const interval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 1) {
            setHearts(hearts - 1);
            if (hearts === 0) setEndGame(true);

            return prevCountdown - 1;
          }
          setIsAnimation(true);

          return 0;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isAnimation, showTutorialModal, hearts, setHearts, setEndGame]);

  useEffect(() => {
    if (showTutorialModal) {
      setIsAnimation(false);

      return;
    }

    if (!isCountingView && !showTutorialModal) {
      generateNewBlock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCountingView, showTutorialModal]);

  useEffect(() => {
    startTimer();
    if (isCountingView) {
      resetTimer();
      stopTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCountingView]);

  useEffect(() => {
    if (hearts === -1) {
      setEndGame(true);
      setIsAnimation(false);
    }
  }, [hearts, isAnimation, setEndGame]);

  return (
    <div className={styles.mainGameContainer}>
      <div className={styles.gameSettings}>
        <div className={styles.pointsContainer}>
          <Text>{t('senior_games_snake_eaten_blocks')}</Text>
          <Text className={styles.points}>{eatenBlock}</Text>
        </div>
        <Text>{t('senior_games_snake_ascending_order')}</Text>
      </div>

      <div ref={boardRef} className={styles.boardContainer}>
        <div className={styles.leftDashedLine} />
        <div className={styles.rightDashedLine} />
        <motion.div
          className={styles.snake}
          animate={{ left: snakePosition }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 5,
          }}
        >
          <Snake style={{ width: '100%', height: '100%' }} />
        </motion.div>

        {numberBlockPosition.map(block => (
          <motion.div
            key={`Block${block.id}_${block.position}_${hearts}`}
            style={{
              left: `calc(${block.position} - ${blockWidth / 2}px)`,
            }}
            className={styles.numberBlock}
            animate={isAnimation && !showTutorialModal && { top: '100%' }}
            transition={{
              duration: gameSpeed,
              ease: 'linear',
            }}
            onAnimationComplete={() => handleAnimationComplete()}
            onUpdate={position => checkIfBlockEaten(position.top, block.id)}
          >
            {block.id}
          </motion.div>
        ))}

        {xBlocksPositions.map(xBlock => (
          <motion.div
            key={`XBlock${xBlock.id}-${xBlock.position}_${hearts}`}
            style={{
              left: `calc(${xBlock.position} - ${blockWidth / 2}px)`,
              border: xBlock.isXBlock ? 'none' : '1px solid #bcbbdc',
            }}
            className={styles.xBlock}
            animate={isAnimation && !showTutorialModal && { top: '100%' }}
            transition={{
              duration: gameSpeed,
              ease: 'linear',
            }}
          >
            {xBlock.isXBlock ? (
              <XBlock style={{ width: '100%', height: '100%' }} />
            ) : (
              differentBlock
            )}
          </motion.div>
        ))}
        {isCountingView && (
          <div className={styles.countingView}>{countdown !== 1 ? countdown - 1 : 'GO'}</div>
        )}
        {!isAnimation && <div className={styles.heartsView}>{heartsGif[hearts]}</div>}
      </div>
      <div className={styles.buttonsContainer}>
        <Button disabled={isCountingView} className={styles.button} onClick={handleLeftArrowClick}>
          <LeftOutlined />
        </Button>
        <Button disabled={isCountingView} className={styles.button} onClick={handleRightArrowClick}>
          <RightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default GameLogic;
