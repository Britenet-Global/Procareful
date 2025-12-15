import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors, fontSizes } = globalStyles;

const sharedItemContainerStyles = css`
  display: flex;
  align-items: center;
  height: 5.2rem;
  padding: 2.4rem 1.6rem;
  transition: background-color 0.4s ease;
`;

export const useStyles = createStyles(({ css, token }) => ({
  itemContainer: css`
    ${sharedItemContainerStyles};

    &:hover {
      background-color: ${accentColors.colorBgLayout30};
    }
  `,
  itemContainerActive: css`
    ${sharedItemContainerStyles};
    background-color: ${accentColors.colorBgLayout20};
  `,
  itemText: css`
    font-weight: 600 !important;
    color: ${token.colorPrimaryBg};
    font-size: ${fontSizes.fontSizeHeading6};
    transition: color 0.4s ease;

    &:hover {
      color: ${token.colorPrimaryBg};
    }
  `,
  itemIcon: css`
    color: ${token.colorPrimaryBg};
    margin-right: 0.8rem;

    svg {
      height: 2rem;
      width: 2rem;
    }
  `,
}));
