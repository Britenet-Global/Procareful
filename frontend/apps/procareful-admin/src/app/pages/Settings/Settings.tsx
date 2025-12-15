import { useQueryClient } from '@tanstack/react-query';
import InfoTile from '@ProcarefulAdmin/components/InfoTile';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  AdminRolesDtoRoleName,
  getAuthControllerGetMeQueryKey,
  type GetMeResponseDto,
} from '@Procareful/common/api';
import { getFormalCaregiverConfig, getInformalCaregiverConfig } from './constants';
import { useStyles } from './styles';

const Settings = () => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isFormalCaregiver = verifyAccessByRole(
    AdminRolesDtoRoleName.formalCaregiver,
    userData?.details.admin.roles
  );

  const settingsConfigItems = isFormalCaregiver
    ? getFormalCaregiverConfig
    : getInformalCaregiverConfig;

  return (
    <div className={styles.container}>
      {settingsConfigItems?.map(({ id, ...settingOptionProps }) => (
        <InfoTile
          key={id}
          variant="link"
          shadow
          containerStyle={styles.tileContainer}
          {...settingOptionProps}
        />
      ))}
    </div>
  );
};

export default Settings;
