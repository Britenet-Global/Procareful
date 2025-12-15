import { Paragraph } from '@Procareful/ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HeatMapLegend from './HeatMapLegend';
import { useStyles } from './styles';

type ChartDescriptionProps = {
  description: string;
  showHeatMapLegend?: boolean;
  className?: string;
};

const ChartDescription = ({ description, showHeatMapLegend, className }: ChartDescriptionProps) => {
  const { styles, cx } = useStyles();

  return (
    <div className={styles.descriptionContainer}>
      <InfoOutlinedIcon className={styles.icon} />
      <Paragraph className={cx(styles.description, className)}>{description}</Paragraph>
      {showHeatMapLegend && <HeatMapLegend />}
    </div>
  );
};

export default ChartDescription;
