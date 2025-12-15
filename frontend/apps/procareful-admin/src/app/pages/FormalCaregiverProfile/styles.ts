import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
  `,
  left: css`
    min-width: 30rem;
    display: flex;
    align-items: flex-start;
    margin-right: 1.6rem;
  `,
  right: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    row-gap: 1.6rem;
  `,
  sectionTitle: css`
    font-size: ${globalStyles.fontSizes.fontSizeSM} !important;
    color: ${globalStyles.accentColors.colorNeutral};
    margin-bottom: 0.8rem !important;
  `,
  avatar: css`
    margin-bottom: 1.6rem;
    min-width: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  name: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
  `,
  addressPlaceholder: css`
    color: ${token.colorTextDescription};
  `,
  sectionContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  addressContainer: css`
    margin-top: 1.6rem;
  `,
  formalCaregiverTitle: css`
    color: ${token.colorTextDescription};
    font-size: ${globalStyles.fontSizes.fontSize} !important;
    margin-bottom: 1.6rem !important;
  `,
  tagContainer: css`
    display: flex;
    justify-content: flex-start;
    column-gap: 0.8rem;
    max-width: 50rem;
  `,
  tag: css`
    margin-right: 0.2rem;
    width: min-content;
  `,
  avatarContainer: css`
    display: flex;
    flex-direction: column;
  `,
  workingHoursContainer: css`
    margin-top: 3rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.3rem 6rem;
  `,
  noDataPlaceholderText: css`
    color: ${token.colorTextDescription};
  `,
}));
