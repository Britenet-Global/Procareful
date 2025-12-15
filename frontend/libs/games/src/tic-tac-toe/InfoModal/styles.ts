import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  modalContainer: css`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: 2rem;
    background-color: ${globalStyles.gamesColors.modalBackdropColor};
    z-index: 100;
  `,
  container: css`
    display: flex;
    align-items: center;
  `,
  infoContainer: css`
    width: clamp(30%, 60rem, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: ${globalStyles.gamesColors.basicWhite};
    border-radius: 0.2rem;
    padding-inline: 1.6rem;
    padding-block: 2.4rem;
  `,
  headingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  `,
  heading: css`
    font-size: ${globalStyles.fontSizes.fontSizeXL};

    @media screen and (max-width: 290px) {
      font-size: ${globalStyles.fontSizes.fontSizeHeading5};
    }
  `,
  icon: css`
    font-size: 2.4rem !important;
    color: ${globalStyles.themeColors.colorWarning};
    margin-left: 1rem;
    padding-top: 0.2rem;
  `,
  descriptionContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1.6rem 0 3.2rem;

    & > span {
      font-size: ${globalStyles.fontSizes.fontSizeLG};

      @media screen and (max-width: 290px) {
        font-size: ${globalStyles.fontSizes.fontSize};
      }
    }
  `,
  button: css`
    width: 100%;
    @media screen and (max-width: 290px) {
      font-size: 1.5rem !important;
    }
  `,
}));
