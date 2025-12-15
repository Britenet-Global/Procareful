import { Tooltip } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { legendElements } from './constants';
import { useStyles } from './styles';

const HeatMapLegend = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <Text className={styles.text}>{t('admin_inf_less')}</Text>
      <div className={styles.elementsContainer}>
        {legendElements.map(({ id, text, className }) => (
          <Tooltip
            key={id}
            title={<Text className={styles.tooltipText}>{text}</Text>}
            color={'white'}
          >
            <div className={cx(styles.element, styles[className])} />
          </Tooltip>
        ))}
      </div>
      <Text className={styles.text}>{t('admin_inf_more')}</Text>
    </div>
  );
};

export default HeatMapLegend;
