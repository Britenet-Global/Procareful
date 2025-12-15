import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
  `,
  userPhotoContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1.6rem;
  `,
  letterContainer: css`
    position: absolute;
    background-color: transparent !important;
  `,
  userDescriptionContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `,
}));
