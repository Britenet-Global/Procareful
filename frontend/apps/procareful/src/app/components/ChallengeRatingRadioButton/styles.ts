import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  inputLabel: css`
    margin-bottom: 1.6rem;

    &::before {
      content: '*';
      color: ${token.colorError};
      margin-right: 0.3rem;
    }
  `,
  radioButtonContainer: css`
    display: flex;
    column-gap: 2.4rem;
    justify-content: center;
  `,
  radioButton: css`
    &:hover {
      cursor: pointer;
    }

    & input {
      display: none;
    }

    & circle {
      fill: ${token.colorInfoBg};
      transition: fill 0.2s;
    }
  `,
  radioButtonSelected: css`
    & circle {
      fill: ${token.colorInfoBgHover};
    }
  `,
  submitButton: css`
    margin: auto auto 0;
    width: 100%;
  `,
}));
