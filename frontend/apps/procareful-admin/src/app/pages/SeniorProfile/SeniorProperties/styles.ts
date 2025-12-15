import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ token, css }) => ({
  cardContainer: css`
    padding-inline: 2.4rem !important;
  `,
  basicInfoContainer: css`
    margin-bottom: 0.8rem;
  `,
  container: css`
    display: flex;
    flex: 1;
    flex-direction: column;
  `,
  contactDataContainer: css`
    display: flex;
    flex-direction: column;
  `,
  avatar: css`
    margin-bottom: 1.6rem;
    min-width: 6rem;
    margin-right: 0.8rem;
  `,
  seniorName: css`
    font-size: ${fontSizes.fontSizeHeading6};
  `,
  smallerFontSize: css`
    font-size: ${fontSizes.fontSize};
  `,

  horizontalAlignment: css`
    display: flex;
    column-gap: 0.3rem;
    flex-direction: row;
  `,
  verticalAlignment: css`
    flex-direction: column;
  `,
  addressPlaceholder: css`
    color: ${token.colorTextDescription};
  `,
  sectionTitle: css`
    font-size: ${fontSizes.fontSizeSM} !important;
    color: ${accentColors.colorNeutral};
    margin-bottom: 0.8rem !important;
  `,
  supportingTitleMargin: css`
    margin-bottom: 0.8rem !important;
  `,
  divider: css`
    margin-block: 2rem !important;
  `,
  nameContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `,
  senior: css`
    color: ${token.colorTextDescription};
    font-size: ${fontSizes.fontSize} !important;
  `,
  seniorWithOneMissingData: css`
    margin-bottom: 0.4rem !important;
  `,
  seniorWithFullData: css`
    margin-bottom: 1.6rem !important;
  `,

  sectionContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  addressContainer: css`
    margin-top: 1.6rem;
  `,

  headerText: css`
    font-weight: 700 !important;
    font-size: ${globalStyles.fontSizes.fontSize};
  `,
  subSection: css`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 0.4rem;
  `,
}));
