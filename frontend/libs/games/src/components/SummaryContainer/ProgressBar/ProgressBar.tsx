import { Fragment } from 'react';
import { GameResult, type Round } from '@Procareful/games';
import { useStyles } from './styles';

type ProgressBarProps = {
  playedRounds: Round[];
};

const ProgressBar = ({ playedRounds }: ProgressBarProps) => {
  const { styles, cx } = useStyles();

  const gamesPlayed = playedRounds.filter(({ status }) => status !== null).length;

  return (
    <div className={styles.progressBar}>
      {playedRounds.map(({ status, id }, index) => (
        <Fragment key={id}>
          {index !== 0 && <div className={styles.line} />}
          <div
            className={cx(styles.bullet, {
              [styles.activeDot]: index === gamesPlayed,
              [styles.won]: status === GameResult.WON,
              [styles.lost]: status === GameResult.LOST,
              [styles.draw]: status === GameResult.DRAW,
            })}
          >
            <div
              className={cx({
                [styles.activeDotNumber]: index === gamesPlayed,
                [styles.inactiveDotNumber]: index !== gamesPlayed,
              })}
            >
              {id}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
