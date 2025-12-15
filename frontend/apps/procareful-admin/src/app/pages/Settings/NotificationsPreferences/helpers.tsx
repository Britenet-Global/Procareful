import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  type GetNotificationSettingsDto,
  type UpdateNotificationSettingsDto,
  type AdminRolesDto,
  AdminRolesDtoRoleName,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

type CheckboxTable = {
  value: boolean;
  isDisabled: boolean;
};

export type DataType = {
  key: string;
  title: string;
  appNotification: CheckboxTable;
  emailNotification: CheckboxTable;
};

type MappedNotificationData = Omit<GetNotificationSettingsDto, 'created_at' | 'id' | 'updated_at'>;

const notificationDisabledBaseOption = {
  user_completed_assignment: false,
  new_message: false,
  new_note: false,
  new_care_plan: false,
};

const notificationDisabledOption = (isUserFormalCaregiver: boolean) => {
  if (isUserFormalCaregiver) {
    return {
      performance_decline: true,
      user_inactive_7_days: true,
      monitoring_visit: true,
      new_senior: true,
      new_IC_assigned: true,
      ...notificationDisabledBaseOption,
    };
  }

  return {
    performance_decline: true,
    user_inactive_7_days: true,
    monitoring_visit: true,
    new_FC_assigned: false,
    ...notificationDisabledBaseOption,
  };
};

export const transformToNotificationObjectToSend = (
  notificationValues?: DataType[]
): UpdateNotificationSettingsDto | undefined => {
  if (!notificationValues) return;

  const result = {};

  notificationValues.forEach(item => {
    const inAppKey = `${item.key}_in_app`;
    const emailKey = `${item.key}_email`;

    const updatedResult = {
      [inAppKey]: item.appNotification.value,
      [emailKey]: item.emailNotification.value,
    };

    Object.assign(result, updatedResult);
  });

  return result;
};

export const mapNotificationObjectToDisplay = (
  notificationData?: MappedNotificationData,
  userRoles?: AdminRolesDto[]
) => {
  if (!notificationData) {
    return;
  }

  const isUserFormalCaregiver = verifyAccessByRole(
    AdminRolesDtoRoleName.formalCaregiver,
    userRoles
  );

  const result: DataType[] = [];
  const keys = Object.keys(notificationData);
  const inAppKeys = keys.filter(key => key.endsWith('_in_app'));

  inAppKeys.forEach(key => {
    const baseKey = key.replace('_in_app', '');
    const emailKey = `${baseKey}_email`;
    const translationKey = `admin_table_${baseKey}`;
    const appNotificationOptionValue = notificationData[key as keyof MappedNotificationData];
    const emailNotificationOptionValue = notificationData[emailKey as keyof MappedNotificationData];

    if (appNotificationOptionValue === null || emailNotificationOptionValue === null) {
      return;
    }

    const notificationDisabledByRoleOption = notificationDisabledOption(isUserFormalCaregiver);
    const isDisabled =
      notificationDisabledByRoleOption[baseKey as keyof typeof notificationDisabledByRoleOption];

    result.push({
      key: baseKey,
      title: i18n.t(translationKey),
      appNotification: {
        value: appNotificationOptionValue,
        isDisabled,
      },
      emailNotification: {
        value: emailNotificationOptionValue,
        isDisabled,
      },
    });
  });

  return result;
};
