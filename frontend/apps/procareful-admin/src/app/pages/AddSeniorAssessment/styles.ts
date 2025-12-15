import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    min-height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  `,
  stepper: css`
    margin-bottom: 1.6rem !important;
  `,
  buttonsContainer: css`
    margin-top: auto;
  `,
  button: css`
    width: min-content !important;
    padding-inline: 2rem !important;
  `,
}));
