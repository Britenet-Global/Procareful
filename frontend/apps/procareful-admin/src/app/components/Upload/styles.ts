import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';
import { type PlaceholderSize } from './Upload';

type StyleProps = {
  placeholderSize: PlaceholderSize;
};

export const useStyles = createStyles(
  ({ css, token }, { placeholderSize = 'small' }: StyleProps) => {
    const getSize = (sizeType: 'container' | 'upload') => {
      if (placeholderSize === 'small') {
        return sizeType === 'container' ? '11.2rem !important' : '11.2rem !important';
      }

      return sizeType === 'container' ? '18rem !important' : '15.2rem !important';
    };

    const containerSize = getSize('container');
    const uploadSize = getSize('upload');

    return {
      container: css`
        width: ${containerSize};
        height: ${containerSize};
      `,
      upload: css`
        .ant-upload-list-item,
        .ant-upload {
          width: ${uploadSize};
          height: ${uploadSize};
        }
      `,
      uploadIcon: css`
        border: 0;
        font-size: 2.8rem !important;
        color: ${token.colorIcon};
      `,
      uploadContainer: css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 0.4rem;
        width: 11.2rem !important;
        height: 11.2rem !important;
      `,
      uploadText: css`
        margin-top: 0.8rem;
        color: ${token.colorTextDescription};
        font-size: ${globalStyles.fontSizes.fontSize} !important;
      `,
      image: css`
        width: 100%;
        height: 100%;
        object-fit: contain;
      `,
      imageWrapper: css`
        display: none;
      `,
    };
  }
);
