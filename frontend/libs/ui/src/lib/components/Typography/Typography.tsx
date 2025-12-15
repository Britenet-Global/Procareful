import { forwardRef, type ComponentProps } from 'react';
import { Typography as AntTypography } from 'antd';
import { globalStyles } from '../../constants';
import { useStyles } from './styles';

type ExtendedTitleProps = Omit<ComponentProps<typeof AntTypography.Title>, 'level'> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

type HeadingFontSizeKey =
  | 'fontSizeHeading1'
  | 'fontSizeHeading2'
  | 'fontSizeHeading3'
  | 'fontSizeHeading4'
  | 'fontSizeHeading5'
  | 'fontSizeHeading6';

const { fontSizes } = globalStyles;

const Title = ({ level, children, className, ...props }: ExtendedTitleProps) => {
  const { styles, cx } = useStyles();
  const header = `fontSizeHeading${level}` as HeadingFontSizeKey;

  if (level === 6) {
    return (
      <h6 style={{ fontSize: fontSizes[header] }} className={className}>
        {children}
      </h6>
    );
  }

  return (
    <AntTypography.Title
      level={level}
      className={cx(styles.title, className)}
      {...props}
      style={{ fontSize: fontSizes[header] }}
    >
      {children}
    </AntTypography.Title>
  );
};

type ParagraphProps = React.ComponentProps<typeof AntTypography.Paragraph>;

const Paragraph = ({ children, className, ...props }: ParagraphProps) => {
  const { styles, cx } = useStyles();

  return (
    <AntTypography.Paragraph {...props} className={cx(styles.paragraphContainer)}>
      <p className={cx(styles.paragraph, className)}>{children}</p>
    </AntTypography.Paragraph>
  );
};

type TextProps = React.ComponentProps<typeof AntTypography.Text>;

const Text = forwardRef<HTMLSpanElement, TextProps>(({ children, className, ...props }, ref) => {
  const { styles, cx } = useStyles();

  return (
    <AntTypography.Text ref={ref} className={cx(styles.text, className)} {...props}>
      {children}
    </AntTypography.Text>
  );
});
Text.displayName = 'Text';

export { Title, Paragraph, Text };
