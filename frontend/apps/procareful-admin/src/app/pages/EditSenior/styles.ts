import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  activateCardContainer: css`
    padding: 2rem 1.6rem;
    max-height: 7.2rem;
  `,
  buttonHidden: css`
    display: none;
  `,
}));

export const styles = {
  editIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${globalStyles.editIcon.color};

    &:hover {
      cursor: pointer;
    }
  `,
  tagContainer: css`
    display: flex;
    width: min-content;
    justify-content: flex-start;
    column-gap: 0.8rem;
  `,
  tag: css`
    margin: 0.2rem;
  `,
};
