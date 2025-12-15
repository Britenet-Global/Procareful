import { globalStyles } from '@Procareful/ui';
import { createStylish } from 'antd-style';

export const useStylish = createStylish(({ css }) => ({
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
      fill: ${globalStyles.accentColors.colorPurpleHover} !important;
      font-size: 12rem !important;
      width: 12rem;
      height: 12rem;
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
    text-align: center;
  `,
  description: css`
    text-align: center;
    padding-bottom: 1.6rem;
    padding-inline: 0.4rem;
  `,
  iconsMainContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
  `,
  repetitionContainer: css`
    & :last-child {
      margin-left: 1rem;
    }
  `,
  iconContainer: css`
    display: flex;
    align-items: center;
    gap: 0.8rem;
  `,
  timeIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
  `,
  brainIcon: css`
    margin-left: 0.5rem !important;
  `,
  iconDescription: css`
    &:first-of-type {
      margin-right: 0.5rem !important;
    }
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: clamp(1.2rem, 2.4rem, 2.4rem);
  `,
}));
