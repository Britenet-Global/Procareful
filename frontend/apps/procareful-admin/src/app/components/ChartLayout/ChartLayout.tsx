import type { ReactNode } from 'react';
import type { SelectProps } from 'antd';
import type { ChartTypes } from '@ProcarefulAdmin/typings';
import StyledCard from '../StyledCard';
import ChartDescription from './ChartDescription';
import ChartHeader from './ChartHeader';
import { useStyles } from './styles';

type ChartProps = {
  children: ReactNode;
  selectMenus?: SelectProps[];
  description?: string;
  title: string;
  subtitle: string;
  shadowContainer?: boolean;
  containerBordered?: boolean;
  className?: string;
  chartType?: ChartTypes;
  fitContent?: boolean;
  showHeatMapLegend?: boolean;
  descriptionClassName?: string;
  graphContainerClassName?: string;
};

const ChartLayout = ({
  children,
  selectMenus,
  description = '',
  title,
  subtitle,
  className,
  shadowContainer = true,
  containerBordered = false,
  fitContent,
  chartType,
  showHeatMapLegend,
  descriptionClassName,
  graphContainerClassName,
}: ChartProps) => {
  const { styles, cx } = useStyles();
  const isNotColumnType = chartType === 'bar' || chartType === 'line' || chartType === 'circular';

  return (
    <StyledCard
      title={
        <ChartHeader
          selectMenus={selectMenus}
          title={title}
          subtitle={subtitle}
          showHeatMapLegend={showHeatMapLegend}
        />
      }
      shadow={shadowContainer}
      className={className}
      fullHeight
      fitContent={fitContent}
      withBorders={containerBordered}
    >
      <div className={cx(styles.graphContainer, graphContainerClassName)}>{children}</div>
      {isNotColumnType && (
        <ChartDescription
          description={description}
          showHeatMapLegend={showHeatMapLegend}
          className={descriptionClassName}
        />
      )}
    </StyledCard>
  );
};

export default ChartLayout;
