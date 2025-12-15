import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

const { fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  carouselContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  `,
  imageContainer: css`
    display: flex;
    justify-content: center;
    width: 100%;
    max-height: 45rem;
    margin-bottom: 0;
    margin-block: auto;
  `,
  carouselImage: css`
    width: auto;
    height: 100%;
  `,
  shadowImage: css`
    box-shadow: ${globalStyles.containerBoxShadow};
    border-radius: 1rem;
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
    margin-bottom: 0.8rem !important;
  `,
  description: css`
    text-align: center;
    margin-top: 0.8rem;
    width: 100%;
    font-size: ${fontSizes.fontSizeHeading6};
    line-height: 2.4rem;
  `,
}));
