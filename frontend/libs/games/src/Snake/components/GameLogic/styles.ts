import { createStyles } from 'antd-style';
import { blockWidth, snakeWidth } from '../../constants';

export const useStyles = createStyles(({ css }) => ({
  mainGameContainer: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
  `,
  gameSettings: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.6rem;
    font-size: 2.4rem;
  `,
  pointsContainer: css`
    display: flex;
    column-gap: 0.8rem;
  `,
  points: css`
    font-weight: 700 !important;
  `,
  boardContainer: css`
    width: 100%;
    height: 60%;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    z-index: 1;
  `,
  leftDashedLine: css`
    position: absolute;
    top: 0;
    left: 33.33%;
    height: 100%;
    width: 1px;
    border-left: 2px dashed #9aa5b1;
    z-index: 0;
  `,
  rightDashedLine: css`
    position: absolute;
    top: 0;
    left: 66.66%;
    height: 100%;
    width: 1px;
    border-left: 2px dashed #9aa5b1;
    z-index: 0;
  `,
  buttonsContainer: css`
    display: flex;
    justify-content: space-around;
    margin-top: 4.8rem;
  `,
  snake: css`
    width: ${snakeWidth}px;
    height: 25%;
    position: absolute;
    bottom: 0;
    z-index: 2;
  `,
  numberBlock: css`
    position: absolute;
    width: ${blockWidth}px;
    height: ${blockWidth}px;
    top: -50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 2.4rem;
    border: 1px solid #bcbbdc;
    border-radius: 6px;
    font-weight: 700;
  `,
  xBlock: css`
    position: absolute;
    width: ${blockWidth}px;
    height: ${blockWidth}px;
    top: -50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 2.4rem;
    border: 1px solid #bcbbdc;
    border-radius: 6px;
    font-weight: 700;
  `,
  button: css`
    width: 6rem;
    height: 6rem;
  `,
  countingView: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(31, 41, 51, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    color: #000;
    font-size: 128px;
    font-weight: 700;
  `,
  heartsView: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(31, 41, 51, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    color: #000;
    font-size: 2.4rem;
    font-weight: 700;
  `,
}));
