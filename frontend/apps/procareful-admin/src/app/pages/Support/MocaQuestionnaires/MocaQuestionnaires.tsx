import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { useTypedTranslation } from '@Procareful/common/lib';
import { mocaQuestionnairesItems } from './constants';
import { columnData } from './helpers';
import { useStyles } from './styles';

const MocaQuestionnaires = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  return (
    <TableLayout
      dataSource={mocaQuestionnairesItems}
      columns={columnData}
      pagination={false}
      rowKey={record => record.id}
      containerClassName={styles.cardContainer}
      tableHeader={
        <TableHeader
          title={t('admin_title_support_moca_questionnaires')}
          subtitle={t('admin_inf_support_find_pdf_moca_versions')}
        />
      }
    />
  );
};

export default MocaQuestionnaires;
