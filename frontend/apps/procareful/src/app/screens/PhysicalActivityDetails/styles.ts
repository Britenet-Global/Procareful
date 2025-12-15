import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `,
  imageContainer: css`
    display: flex;
    justify-content: center;
    margin-bottom: 2.4rem;
  `,
  circularBackground: css`
    background-color: ${globalStyles.accentColors.colorPurpleBg} !important;
    border-radius: 50%;
    padding: 1.5rem;

    & > svg {
      color: ${globalStyles.accentColors.colorPurpleHover} !important;
      font-size: 12rem !important;
    }
  `,
  headingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  titleHeader: css`
    padding-bottom: 1.6rem;
  `,
  description: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
    text-align: center;
    padding-bottom: 1.6rem;
  `,
  iconsMainContainer: css`
    display: flex;
    justify-content: center;
    gap: 1.6rem;
  `,
  iconContainer: css`
    display: flex;
    gap: 0.8rem;
  `,
  timeIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
  `,
  iconDescription: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: column;
    padding-bottom: clamp(1.2rem, 2.4rem, 2.4rem);
  `,
  videoButton: css`
    margin-top: clamp(1.2rem, 2.2rem, 2.2rem);
  `,
}));
