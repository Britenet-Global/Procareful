import { createStyles } from 'antd-style';

type StyleProps = {
  underline: boolean;
};

export const useStyles = createStyles(({ token, css }, { underline }: StyleProps) => ({
  redirectLink: css`
    color: ${token.colorPrimary} !important;
    text-decoration: ${underline ? 'underline !important' : 'none'};
    width: fit-content;

    :hover {
      color: ${token.colorPrimary} !important;
    }
  `,
}));
