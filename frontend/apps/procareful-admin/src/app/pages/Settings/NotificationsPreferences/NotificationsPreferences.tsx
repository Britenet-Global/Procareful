import { useQueryClient } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';
import ActionFooter from '@ProcarefulAdmin/components/FormControls';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import {
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  getCaregiverControllerGetNotificationSettingsQueryKey,
  useCaregiverControllerGetNotificationSettings,
  useCaregiverControllerUpdateNotificationSettings,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { mapNotificationObjectToDisplay, transformToNotificationObjectToSend } from './helpers';
import { useCheckboxTableData } from './hooks';

const NotificationPreferences = () => {
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );
  const { data, isLoading } = useCaregiverControllerGetNotificationSettings();
  const formattedNotificationData = mapNotificationObjectToDisplay(
    data?.details,
    userData?.details.admin.roles
  );
  const { columnData, rowData, handleResetData } = useCheckboxTableData(formattedNotificationData);
  const isUnsavedChange = !isEqual(formattedNotificationData, rowData);

  const { mutate: updateNotificationPreferences, isPending } =
    useCaregiverControllerUpdateNotificationSettings({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetNotificationSettingsQueryKey(),
          });

          notificationApi.success({
            message: t('admin_form_alert_saved'),
            description: t('admin_form_alert_successfully_saved_data'),
          });
        },
        onError: () => {
          notificationApi.success({
            message: t('admin_title_alert_error'),
            description: t('shared_alert_server_error_description'),
          });
        },
      },
    });

  useOnboardingStepComplete();

  const handleSubmitData = () => {
    const transformedNotificationData = transformToNotificationObjectToSend(rowData);

    if (transformedNotificationData) {
      updateNotificationPreferences({ data: transformedNotificationData });
    }
  };

  return (
    <>
      <TableLayout
        dataSource={rowData}
        columns={columnData}
        pagination={false}
        loading={isLoading}
        tableHeader={<TableHeader title={t('admin_title_notifications_preferences')} />}
      >
        <ActionFooter onReset={handleResetData} onSubmit={handleSubmitData} loading={isPending} />
      </TableLayout>
      <NavigationBlockerModal shouldBlock={isUnsavedChange} />
    </>
  );
};

export default NotificationPreferences;
