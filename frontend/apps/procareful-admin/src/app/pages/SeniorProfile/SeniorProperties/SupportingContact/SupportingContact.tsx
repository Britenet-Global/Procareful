import { formatPhoneToDisplay } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type SupportingContactProps = {
  firstName: string;
  lastName: string;
  relation: string;
  phoneNumber: string;
  emailAddress: string;
};

const SupportingContact = ({
  firstName,
  lastName,
  relation,
  phoneNumber,
  emailAddress,
}: SupportingContactProps) => {
  const { styles } = useStyles();
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className={styles.container}>
      <Text strong className={styles.headerText}>
        {fullName}
      </Text>
      <Text className={styles.supportingContactRelation}>{relation}</Text>
      <Text>{formatPhoneToDisplay(phoneNumber)}</Text>
      <Text>{emailAddress}</Text>
    </div>
  );
};

export default SupportingContact;
