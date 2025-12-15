import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `,
  headerContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  descriptionContainer: css`
    width: clamp(40rem, 50%, 83.2rem);
    margin-top: 0.4rem;
  `,
  button: css`
    color: ${globalStyles.accentColors.colorNeutralActive} !important;
    display: flex;
    align-items: center;

    .ant-btn-icon > svg {
      font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
      color: ${globalStyles.editIcon.color};
    }
  `,
  activityContainer: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 2;
    row-gap: 2.4rem;
    column-gap: 1.6rem;
    margin-top: 2.4rem;
  `,
  formButtonContainer: css`
    justify-content: space-between;
  `,
  formButton: css`
    width: fit-content !important;
  `,
}));
