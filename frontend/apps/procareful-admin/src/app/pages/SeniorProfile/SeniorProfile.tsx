import { useQueryClient } from '@tanstack/react-query';
import { type LinkProps, useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import InfoTile from '@ProcarefulAdmin/components/InfoTile';
import NotificationAlert from '@ProcarefulAdmin/components/NotificationAlert';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  AdminRolesDtoRoleName,
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  useCaregiverControllerGetFamilyDoctor,
  useCaregiverControllerGetSupportingContact,
  useCaregiverControllerGetUser,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams, type Key } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import SeniorProperties from './SeniorProperties';
import { informalCaregiverTabItems, formalCaregiverTabItems } from './constants';
import { getBannerToShow } from './helpers';
import { useStyles } from './styles';

export const SeniorProfile = () => {
  const { styles, cx } = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTypedTranslation();
  const seniorId = searchParams.get(SearchParams.Id);
  const defaultActiveKey = t('admin_btn_notes');
  const activeKey = searchParams.get(SearchParams.Name);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formattedInformalCaregiverTab = informalCaregiverTabItems?.map(({ label, ...items }) => ({
    ...items,
    label: t(label as Key),
  }));
  const formattedFormalCaregiverTab = formalCaregiverTabItems?.map(({ label, ...items }) => ({
    ...items,
    label: t(label as Key),
  }));

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isFormalCaregiver = verifyAccessByRole(
    AdminRolesDtoRoleName.formalCaregiver,
    userData?.details.admin.roles
  );

  const { data: seniorsData, isLoading } = useCaregiverControllerGetUser(Number(seniorId), {
    page: 1,
    pageSize: PaginationSize.Large,
  });
  const {
    address,
    email_address,
    first_name,
    image,
    last_name,
    phone_number,
    assessment_completed,
    activities_assigned,
  } = seniorsData?.details || {};
  const { city, street, zip_code, building } = address || {};

  const shouldShowAlertAssessment = !assessment_completed;
  const shouldShowActivitiesAlert = Boolean(assessment_completed && !activities_assigned);

  const { title, subtitle, buttonText, redirectTo } =
    getBannerToShow(shouldShowAlertAssessment, shouldShowActivitiesAlert) || {};

  const showAlertBanner =
    title && subtitle && buttonText && redirectTo && seniorId && isFormalCaregiver;

  const { data: { details: supportingContactsData } = {}, isLoading: isLoadingSupportingContacts } =
    useCaregiverControllerGetSupportingContact(Number(seniorId));

  const { data: familyDoctorData, isLoading: isLoadingFamilyDoctor } =
    useCaregiverControllerGetFamilyDoctor(Number(seniorId));

  const handleSearchParamsUpdate = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(SearchParams.Name, key);
    setSearchParams(newSearchParams, { replace: true });
  };

  const activateSeniorAppRedirectConfig: LinkProps['to'] = {
    pathname: PathRoutes.ActivateSeniorApp,
    search: new URLSearchParams({
      [SearchParams.Id]: seniorId || '',
    }).toString(),
  };

  const handleConfirmAlert = () => {
    if (!seniorId) {
      return;
    }

    navigate({
      pathname: redirectTo,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorId,
      }).toString(),
    });
  };

  if (isLoading || isLoadingSupportingContacts || isLoadingFamilyDoctor) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <section className={styles.left}>
        <SeniorProperties
          firstName={first_name || ''}
          lastName={last_name || ''}
          phoneNumber={phone_number || ''}
          emailAddress={email_address || ''}
          street={street || ''}
          building={building}
          city={city}
          zipCode={zip_code}
          avatarImage={image || ''}
          supportingContacts={supportingContactsData}
          familyDoctor={familyDoctorData?.details?.[0]?.contact}
        />
      </section>
      <section className={styles.right}>
        {showAlertBanner && (
          <NotificationAlert
            title={title}
            subtitle={subtitle}
            buttonText={buttonText}
            onConfirm={handleConfirmAlert}
          />
        )}
        <InfoTile
          variant="link"
          redirectTo={activateSeniorAppRedirectConfig}
          subtitle={t('admin_inf_assist_your_senior')}
          containerStyle={styles.alert}
          shadow
        />
        <Tabs
          defaultActiveKey={activeKey ?? defaultActiveKey}
          items={isFormalCaregiver ? formattedFormalCaregiverTab : formattedInformalCaregiverTab}
          className={cx(styles.tabs)}
          onTabClick={handleSearchParamsUpdate}
        />
      </section>
    </div>
  );
};

export default SeniorProfile;
