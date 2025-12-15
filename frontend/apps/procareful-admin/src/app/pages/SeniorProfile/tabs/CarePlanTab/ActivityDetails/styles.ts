import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    border: 1px solid ${token.colorBorder};
    padding: 1.6rem;
    margin-bottom: 1.6rem;
    border-radius: 0.4rem;
    display: flex;
    column-gap: 2.4rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  `,
  disabledContainer: css`
    background-color: ${token.colorBgContainerDisabled} !important;
  `,
  disabledText: css`
    color: ${token.colorTextDisabled} !important;
  `,
  bold: css`
    font-weight: 700 !important;
  `,
  levelContainer: css`
    margin-top: 0.2rem;
    margin-bottom: 1.6rem;
  `,
  levelContainerLowerMargin: css`
    margin-bottom: 0.2rem;
  `,
  tagContainer: css`
    margin-top: 0.6rem;
  `,
  tag: css`
    margin: 0.2rem;
  `,
  additionalDescriptionContainer: css`
    margin-top: 1rem;
  `,
}));
