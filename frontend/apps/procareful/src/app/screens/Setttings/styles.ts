import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    padding: 2rem 1rem;
    width: min(90vw, 50rem);
    margin: 1rem auto;
    border-radius: 0.8rem;
    box-shadow: ${globalStyles.containerBoxShadow};
    background-color: ${globalStyles.themeColors.colorBgContainer};
    text-align: center;
  `,
  description: css`
    display: inline-block;
    min-height: 10rem;
  `,
  radioGroup: css`
    margin-top: 4rem;
    min-height: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .ant-radio-inner {
      width: 2rem;
      height: 2rem;
    }
  `,
  sm: css`
    font-size: 1.4rem !important;
  `,
  md: css`
    font-size: 1.6rem !important;
  `,
  lg: css`
    font-size: 1.8rem !important;
  `,
  xl: css`
    font-size: 2rem !important;
  `,
  button: css`
    width: 100%;
    margin-top: 4rem;
  `,
}));
