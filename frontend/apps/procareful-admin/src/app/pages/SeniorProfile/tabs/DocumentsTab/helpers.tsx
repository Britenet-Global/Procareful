import dayjs from 'dayjs';
import { Dropdown, type MenuProps, type TableProps } from 'antd';
import { cx } from 'antd-style';
import type { GetDocumentsDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { TimeFormat } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { MoreHoriz } from '@mui/icons-material';
import { styles } from './styles';

type GetColumnDataParams = {
  onDownload: (documentId: number, documentName: string) => void;
  onRemove: (documentId: number) => void;
  userId?: number;
};

export const getColumnData = ({
  onDownload,
  onRemove,
  userId,
}: GetColumnDataParams): TableProps<GetDocumentsDto>['columns'] => [
  {
    title: i18n.t('admin_table_name'),
    dataIndex: 'name',
    key: 'name',
    width: '65%',
    render: (_, { name }) => <Text>{name}</Text>,
  },
  {
    title: i18n.t('admin_table_date'),
    dataIndex: 'date',
    key: 'date',
    width: '10%',
    render: (_, { created_at }) => {
      const formattedDate = dayjs(created_at).format(TimeFormat.DATE_FORMAT);

      return <Text>{formattedDate}</Text>;
    },
  },
  {
    title: i18n.t('admin_table_added_by'),
    dataIndex: 'addedByy',
    key: 'addedBy',
    width: '15%',

    render: (_, { added_by }) => (
      <Text>
        {added_by.first_name} {added_by.last_name}
      </Text>
    ),
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: '10%',
    render: (_, { id, name, added_by }) => {
      if (!userId) {
        return;
      }

      const showRemoveButton = userId === added_by.id;

      const items: MenuProps['items'] = [
        {
          key: '1',
          label: i18n.t('shared_btn_download'),
          onClick: () => onDownload(id, name),
        },
        ...(showRemoveButton
          ? [
              {
                key: '2',
                danger: true,
                label: i18n.t('admin_btn_remove'),
                onClick: () => onRemove(id),
              },
            ]
          : []),
      ];

      return (
        <Dropdown
          align={{ offset: [-65, 0] }}
          placement="bottomLeft"
          menu={{ items }}
          trigger={['click']}
        >
          <MoreHoriz className={cx(styles.moreIcon)} />
        </Dropdown>
      );
    },
  },
];
