import { type TableProps, Image, Button } from 'antd';
import { cx } from 'antd-style';
import { downloadFile } from '@ProcarefulAdmin/utils/downloadFile';
import { i18n } from '@Procareful/common/i18n';
import DownloadIcon from '@mui/icons-material/Download';
import { type mocaQuestionnairesItems } from './constants';
import { styles } from './styles';

export const columnData: TableProps<(typeof mocaQuestionnairesItems)[0]>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_type');
    },
    dataIndex: 'name',
    key: 'name',
    width: '7%',
    render: () => <Image src="/pdfIcon.svg" width={27} height={32} preview={false} />,
  },
  {
    get title() {
      return i18n.t('admin_table_name');
    },
    dataIndex: 'name',
    key: 'name',
    width: '86%',
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: '7%',
    render: (_, { name, path }) => (
      <Button
        title={i18n.t('shared_btn_download')}
        onClick={() => downloadFile(path, `${name}.pdf`)}
        type="link"
        icon={<DownloadIcon className={cx(styles.downloadIcon)} />}
      />
    ),
  },
];
