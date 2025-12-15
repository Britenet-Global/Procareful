import { type ComponentProps } from 'react';
import { Tag as AntTag } from 'antd';
import { type PresetColorKey } from 'antd/es/theme/internal';
import { useStyles } from './styles';

export type TagColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple';

type CustomColor = Exclude<PresetColorKey, TagColor>;

type ExtendedTagProps = Omit<ComponentProps<typeof AntTag>, 'color'> & {
  color?: CustomColor;
  customColor?: TagColor;
};

export const Tag = ({
  customColor = 'default',
  color,
  className,
  children,
  ...props
}: ExtendedTagProps) => {
  const { styles, cx } = useStyles();

  return (
    <AntTag {...props} color={color} className={cx(styles.tag, styles[customColor], className)}>
      {children}
    </AntTag>
  );
};
