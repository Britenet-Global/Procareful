import { isNil, throttle } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { GameDisplayState } from '@Procareful/games';
import { mergeAnimationDuration } from '../../constants';
import { useGame2048Store } from '../../store/game2048store';
import { useStyles } from '../../styles';
import { MoveDirections } from '../../types';
import MobileSwiper, { type SwipeInput } from '../MobileSwiper';
import Tile from '../Tile';

type BoardProps = {
  handleDiffSubmit: () => void;
};

const Board = ({ handleDiffSubmit }: BoardProps) => {
  const {
    gameState,
    gameConfig,
    gameDisplayState,
    createTile,
    moveDown,
    moveUp,
    moveLeft,
    moveRight,
    cleanUp,
  } = useGame2048Store();
  const { styles, cx } = useStyles(gameConfig.tileCount);
  const initialized = useRef(false);
  const { t } = useTypedTranslation();

  const moveTiles = useMemo(
    () =>
      throttle(
        (type: MoveDirections) => {
          switch (type) {
            case MoveDirections.MoveUp:
              moveUp();
              break;
            case MoveDirections.MoveDown:
              moveDown();
              break;
            case MoveDirections.MoveLeft:
              moveLeft();
              break;
            case MoveDirections.MoveRight:
              moveRight();
              break;
            default:
              break;
          }
        },
        mergeAnimationDuration * 1.05,
        {
          trailing: false,
        }
      ),
    [moveUp, moveDown, moveLeft, moveRight]
  );

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }: SwipeInput) => {
      if (gameDisplayState === GameDisplayState.DIFF) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          return moveTiles(MoveDirections.MoveRight);
        }

        return moveTiles(MoveDirections.MoveLeft);
      }
      if (deltaY > 0) {
        return moveTiles(MoveDirections.MoveDown);
      }

      return moveTiles(MoveDirections.MoveUp);
    },
    [gameDisplayState, moveTiles]
  );

  const renderGrid = () =>
    Array.from({ length: gameConfig.totalCellsCount }).map((_, index) => (
      <div className={cx(styles.cell)} key={index} />
    ));

  const renderTiles = () =>
    gameState.tilesByIds.map(tileId => {
      const tile = gameState.tiles[tileId];

      return <Tile key={tile.id} {...tile} />;
    });

  useEffect(() => {
    if (gameDisplayState === GameDisplayState.DIFF || gameState.status.isFinished) return;

    const getEmptyCells = () => {
      const results: [number, number][] = [];
      const tileCount = gameConfig.tileCount;

      for (let x = 0; x < tileCount; x++) {
        for (let y = 0; y < tileCount; y++) {
          if (isNil(gameState.board[y][x])) {
            results.push([x, y]);
          }
        }
      }

      return results;
    };

    const appendRandomTile = () => {
      const emptyCells = getEmptyCells();
      if (emptyCells.length > 0) {
        const cellIndex = Math.floor(Math.random() * emptyCells.length);
        const newTile = {
          position: emptyCells[cellIndex],
          value: 2,
        };
        createTile(newTile);
      }
    };
    if (gameState.hasChanged && gameState.status.isStarted) {
      setTimeout(() => {
        cleanUp();
        appendRandomTile();
      }, mergeAnimationDuration);
    }
  }, [
    gameDisplayState,
    gameState.hasChanged,
    gameState.board,
    gameState.tiles,
    gameConfig.tileCount,
    gameState.status.isStarted,
    createTile,
    cleanUp,
  ]);

  useEffect(() => {
    const startGame = () => {
      createTile({ position: [0, 1], value: gameConfig.startingNumber });
      createTile({ position: [0, 2], value: gameConfig.startingNumber });
    };

    if (!initialized.current) {
      startGame();
      initialized.current = true;
    }
  }, [createTile, gameConfig.startingNumber]);

  return (
    <>
      <MobileSwiper onSwipe={handleSwipe}>
        <div className={styles.board}>
          <div className={styles.tiles}>{renderTiles()}</div>
          <div className={styles.grid}>{renderGrid()}</div>
        </div>
      </MobileSwiper>
      {gameDisplayState === GameDisplayState.DIFF && (
        <Button
          size="large"
          type="primary"
          className={styles.diffButton}
          onClick={handleDiffSubmit}
        >
          {t('senior_games_end_game_cell')}
        </Button>
      )}
    </>
  );
};

export default memo(Board);
