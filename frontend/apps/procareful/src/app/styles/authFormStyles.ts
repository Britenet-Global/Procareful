import { globalStyles } from '@Procareful/ui';
import { createStylish } from 'antd-style';

export const useStylish = createStylish(({ css }) => ({
  form: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 3.2rem;
  `,
  buttonsContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
    margin-top: auto;
  `,
  phoneInput: css`
    & .ant-input {
      text-align: start;
    }
  `,
  alternativeButton: css`
    margin-top: auto;
    width: 100%;
    height: 4rem;
    font-size: ${globalStyles.fontSizes.fontSizeLG};
  `,
  paragraph: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
  `,
}));
