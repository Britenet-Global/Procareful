import { useSearchParams } from 'react-router-dom';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import InstitutionDetailsForm from '@ProcarefulAdmin/components/forms/InstitutionDetailsForm';
import {
  type GetInstitutionDtoStatusStatusName,
  useAdminControllerGetInstitutionById,
  useAdminControllerGetSuperInstitutionAdmin,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import InstitutionStatusForm from './InstitutionStatusForm';
import SuperAdminDetails from './SuperAdminDetails';
import { useStyles } from './styles';

const InstitutionDetails = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();

  const institutionId = Number(searchParams.get(SearchParams.Id));
  const superAdminId = Number(searchParams.get(SearchParams.SuperAdminId));

  const { data: institutionData, isLoading: isInstitutionDataLoading } =
    useAdminControllerGetInstitutionById(institutionId, {
      query: { enabled: Boolean(institutionId) },
    });

  const { data: superAdminData, isLoading: isSuperInstitutionDataLoading } =
    useAdminControllerGetSuperInstitutionAdmin(superAdminId, {
      query: {
        enabled: Boolean(superAdminId),
      },
    });

  const { email_address, phone_number, status, first_name, last_name, roles } =
    superAdminData?.details || {};

  const {
    id,
    phone,
    email,
    name,
    building,
    city,
    flat,
    street,
    zip_code,
    created_at,
    status: institutionStatus,
  } = institutionData?.details || {};

  if (isInstitutionDataLoading || isSuperInstitutionDataLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <SuperAdminDetails
        firstName={first_name || ''}
        lastName={last_name || ''}
        emailAddress={email_address || ''}
        phoneNumber={phone_number || ''}
        status={status?.status_name}
      />
      <InstitutionStatusForm
        id={id}
        registration={created_at}
        name={name}
        status={institutionStatus?.status_name as unknown as GetInstitutionDtoStatusStatusName}
        userRoles={roles}
      />
      <StyledCard title={t('admin_title_institution_details')}>
        <InstitutionDetailsForm
          phoneNumber={phone || ''}
          emailAddress={email || ''}
          name={name}
          building={building}
          city={city}
          flat={flat}
          street={street}
          zipCode={zip_code}
        />
      </StyledCard>
    </div>
  );
};

export default InstitutionDetails;
