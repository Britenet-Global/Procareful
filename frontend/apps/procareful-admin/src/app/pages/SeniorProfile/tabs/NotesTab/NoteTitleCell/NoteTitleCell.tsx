import { Trans } from 'react-i18next';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type NoteTitleCellProps = {
  title: string;
  attachmentsLength: number;
};

const NoteTitleCell = ({ title, attachmentsLength }: NoteTitleCellProps) => {
  const { styles, cx } = useStyles();

  return (
    <div className={cx(styles.container, { [styles.paddingBlock]: !attachmentsLength })}>
      <Text>{title}</Text>
      {!!attachmentsLength && (
        <Text className={styles.attachments}>
          <Trans
            i18nKey="admin_form_note_attachments_counter"
            values={{ count: attachmentsLength }}
          />
        </Text>
      )}
    </div>
  );
};

export default NoteTitleCell;
