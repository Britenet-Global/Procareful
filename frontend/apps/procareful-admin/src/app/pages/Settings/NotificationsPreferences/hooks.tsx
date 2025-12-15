import { useEffect, useState } from 'react';
import { Checkbox, type TableProps } from 'antd';
import { i18n } from '@Procareful/common/i18n';
import type { DataType } from './helpers';

export const useCheckboxTableData = (data?: DataType[]) => {
  const [rowData, setRowData] = useState(data);

  useEffect(() => {
    if (!data || rowData?.length) {
      return;
    }

    setRowData(data);
  }, [data, rowData]);

  const handleCheckboxChange = (
    value: boolean,
    key: string,
    variant: 'appNotification' | 'emailNotification'
  ) => {
    const rowDataIndex = rowData?.findIndex(data => data.key === key);
    const itemToUpdate = rowData?.find(data => data.key === key);
    const updatedItem = {
      ...itemToUpdate,
      [variant]: { value, isDisabled: false },
    } as DataType;

    setRowData(prevState => {
      const updatedRowData = prevState?.map((rowData, index) => {
        if (index === rowDataIndex) {
          return updatedItem;
        }

        return rowData;
      });

      return updatedRowData;
    });
  };

  const handleResetData = () => {
    setRowData(data);
  };

  const columnData: TableProps<DataType>['columns'] = [
    {
      get title() {
        return i18n.t('admin_table_title');
      },
      dataIndex: 'title',
      key: 'title',
    },
    {
      get title() {
        return i18n.t('admin_table_in_app_notification');
      },
      dataIndex: 'appNotification',
      key: 'appNotification',
      align: 'center',
      width: '20rem',
      render: (_, { appNotification, key }: DataType) => (
        <Checkbox
          disabled={appNotification.isDisabled}
          checked={appNotification.value}
          onChange={e => handleCheckboxChange(e.target.checked, key, 'appNotification')}
        />
      ),
    },
    {
      get title() {
        return i18n.t('admin_table_email_notification');
      },
      dataIndex: 'emailNotification',
      key: 'emailNotification',
      align: 'center',
      width: '20rem',
      render: (_, { emailNotification, key }) => (
        <Checkbox
          disabled={emailNotification.isDisabled}
          checked={emailNotification.value}
          onChange={e => handleCheckboxChange(e.target.checked, key, 'emailNotification')}
        />
      ),
    },
  ];

  return {
    columnData,
    rowData,
    handleResetData,
  };
};
