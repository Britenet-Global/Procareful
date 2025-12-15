import { memo } from 'react';
import { type GameScoreDto } from '@Procareful/common/api';
import Cell from '../Cell';
import SeniorName from '../SeniorName';
import { colorFunction } from '../helpers';
import { useStyles } from './styles';

type LineProps = {
  firstName: string;
  lastName: string;
  scores: GameScoreDto[];
};

const Line = ({ firstName, lastName, scores }: LineProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.line}>
      <SeniorName name={`${firstName} ${lastName}`} />
      <div className={styles.activityLine}>
        {scores.map(({ date, totalTime }, index) => (
          <Cell key={index} color={colorFunction(totalTime)} date={date} />
        ))}
      </div>
    </div>
  );
};

export default memo(Line);
