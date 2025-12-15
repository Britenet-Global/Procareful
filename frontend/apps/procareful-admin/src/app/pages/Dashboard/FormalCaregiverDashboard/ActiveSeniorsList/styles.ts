import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  card: css`
    justify-content: flex-start !important;
  `,
  listContainer: css`
    width: 100%;
    overflow-y: auto;
    margin-top: 1rem;

    &::-webkit-scrollbar {
      width: 0.8rem !important;
    }
  `,
  listItem: css`
    cursor: pointer;
    padding-left: 1rem !important;
    :hover {
      background-color: ${globalStyles.accentColors.colorNeutralBgHover};
    }
  `,
  select: css`
    width: 16rem;
  `,
  spinContainer: css`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10rem;
  `,
  noDataPlaceholder: css`
    margin-top: 5rem;
  `,
}));
