import { formatPhoneToDisplay } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type ContactDataProps = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  emailAddress?: string;
};

const ContactData = ({ firstName, lastName, phoneNumber, emailAddress }: ContactDataProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <Text strong>
        {firstName} {lastName}
      </Text>
      {phoneNumber && <Text>{formatPhoneToDisplay(phoneNumber)}</Text>}
      {emailAddress && <Text>{emailAddress}</Text>}
    </div>
  );
};

export default ContactData;
