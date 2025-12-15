import { Select } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { type Key, useTypedTranslation } from '@Procareful/common/lib';
import { Title, Text } from '@Procareful/ui';
import { useStyles } from './styles';

type ChartHeaderProps = {
  selectMenus?: SelectProps[];
  title: string;
  subtitle: string;
  showHeatMapLegend?: boolean;
};

const ChartHeader = ({ selectMenus, title, subtitle }: ChartHeaderProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const renderSelect = () =>
    selectMenus?.map(({ className, id, options, ...restDropdownProps }) => (
      <Select
        key={id}
        className={className}
        {...restDropdownProps}
        options={options?.map(o => ({ ...o, label: t(o.label as Key) }))}
        virtual
      />
    ));

  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleContainer}>
        <div>
          <Title level={5} className={styles.title}>
            {title}
          </Title>
          <Text className={styles.subtitle}>{subtitle}</Text>
        </div>
        {renderSelect()}
      </div>
    </div>
  );
};

export default ChartHeader;
