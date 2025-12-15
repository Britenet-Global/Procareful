import { Avatar } from 'antd';
import { formatPhoneToDisplay } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type TableUserCellProps = {
  type?: 'senior' | 'caregiver';
  userName: string;
  imageUrl?: string;
  phoneNumber?: string;
};

const TableUserCell = ({
  type = 'senior',
  userName,
  imageUrl,
  phoneNumber,
}: TableUserCellProps) => {
  const { styles } = useStyles();
  const firstLetterInName = userName[0];

  return (
    <div className={styles.container}>
      {type === 'senior' && (
        <div className={styles.userPhotoContainer}>
          <Avatar
            size="large"
            src={`data:image/jpeg;base64,${imageUrl}`}
            alt={`${userName} profile`}
          >
            {!imageUrl && firstLetterInName}
          </Avatar>
        </div>
      )}
      <div className={styles.userDescriptionContainer}>
        <Text strong>{userName}</Text>
        {phoneNumber && <Text>{formatPhoneToDisplay(phoneNumber)}</Text>}
      </div>
    </div>
  );
};

export default TableUserCell;
