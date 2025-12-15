import Heart0 from '@Procareful/ui/assets/images/Snake/heart_0.svg?react';
import Heart1 from '@Procareful/ui/assets/images/Snake/heart_1.svg?react';
import Heart2 from '@Procareful/ui/assets/images/Snake/heart_2.svg?react';
import Heart3 from '@Procareful/ui/assets/images/Snake/heart_3.svg?react';
import Heart4 from '@Procareful/ui/assets/images/Snake/heart_4.svg?react';
import Heart5 from '@Procareful/ui/assets/images/Snake/heart_5.svg?react';
import Heart6 from '@Procareful/ui/assets/images/Snake/heart_6.svg?react';

export const numbersOfBlocksToWin = 30;
export const snakeWidth = 60;
export const blockWidth = 48;
export const gameSpeed = 3;
export const extraPointsForWin = 50;
export const extraPointsForWinInOneCombo = 100;
export const pointsForEatenBlock = 10;
export const heartsAfterGame = -2;
export const POLLING_INTERVAL = 15;

export const positions = {
  firstTrack: `calc(16.67% - ${snakeWidth / 2}px)`,
  middleTrack: `calc(50% -  ${snakeWidth / 2}px)`,
  lastTrack: `calc(83.33% -  ${snakeWidth / 2}px)`,
};

export const blockPositions = ['16.67%', '50%', '83.33%'];

export const heartsGif = [
  <Heart0 key="heart0" />,
  <Heart1 key="heart1" />,
  <Heart2 key="heart2" />,
  <Heart3 key="heart3" />,
  <Heart4 key="heart4" />,
  <Heart5 key="heart5" />,
  <Heart6 key="heart6" />,
];
