import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

const { themeColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  cardContainer: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  imageContainer: css`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 2.4rem;
  `,
  image: css`
    width: 30rem;
  `,
  textContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 4rem;
  `,
  heading: css`
    text-align: center;
  `,
  description: css`
    text-align: center;
    margin-top: 0.8rem !important;
    width: 100%;
    font-size: ${fontSizes.fontSizeHeading5};
    line-height: 2.4rem;
  `,
  mainContainer: css`
    width: 100%;
    max-width: 60rem;
    height: 100%;
    background-color: ${themeColors.colorBgLayout};
    padding: 0 2rem;
    overflow-y: auto;
    overflow-x: hidden;
  `,
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 2.4rem;
  `,
  carouselImage: css`
    width: 70%;
  `,
}));
