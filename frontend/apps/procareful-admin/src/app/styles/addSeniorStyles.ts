import { createStylish } from 'antd-style';

export const useStylish = createStylish(({ css }) => ({
  container: css`
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  `,
  cardContainer: css`
    .ant-card-head-title {
      max-width: 82rem;
    }
    .ant-card-body {
      max-width: 82rem;
    }
  `,
  form: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 2.4rem !important;

    ol {
      counter-reset: list-counter;
      list-style: none;
      padding-left: 0;
      display: flex;
      flex-direction: column;
      row-gap: 0.8rem;
    }

    ol li {
      counter-increment: list-counter;
      margin-right: 2.4rem;
      display: flex;

      &::before {
        content: counter(list-counter) '. ';
        margin-right: 1.6rem !important;
        display: inline-block;
        min-width: 2rem !important;
      }
    }

    & .ant-form-item-label > label {
      font-weight: 700 !important;
      line-height: 2.2rem;
      width: 100%;
    }
  `,
  radioGroup: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.4rem;
  `,
  formButtonContainer: css`
    margin-top: 3.2rem;
  `,
}));
