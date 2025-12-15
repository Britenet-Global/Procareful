import { Spin } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import AddIcon from '@mui/icons-material/Add';
import { useStyles } from './styles';

type UploadButtonProps = {
  loading: boolean;
};

const UploadButton = ({ loading }: UploadButtonProps) => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  return (
    <div className={styles.uploadContainer}>
      {loading ? (
        <Spin size="small" />
      ) : (
        <>
          <AddIcon className={styles.uploadIcon} />
          <Text className={styles.uploadText}>{t('admin_form_add_picture')}</Text>
        </>
      )}
    </div>
  );
};

export default UploadButton;
