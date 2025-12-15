import { useNavigate, useSearchParams } from 'react-router-dom';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import AddSupportingContacts from '@ProcarefulAdmin/components/forms/AddSupportingContacts';
import FamilyDoctor from '@ProcarefulAdmin/components/forms/FamilyDoctor';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { SearchParams, useToggle, useTypedTranslation } from '@Procareful/common/lib';
import FormButtons from '../AddSeniorAssessment/FormButtons';
import { useStyles } from './styles';

const SeniorSupportingContacts = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const [isModalOpen, toggleModal] = useToggle();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const seniorId = searchParams.get(SearchParams.Id);

  const handleModalConfirmation = (redirectPath: PathRoutes) => {
    if (!seniorId) {
      return;
    }

    navigate({
      pathname: redirectPath,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorId,
      }).toString(),
    });
  };

  return (
    <div className={styles.container}>
      <StyledCard
        title={`${t('admin_title_stepper_add_supporting_contacts')} (${t('admin_inf_optional')})`}
        subtitle={t('admin_title_add_two_additional_contacts')}
      >
        <AddSupportingContacts />
      </StyledCard>
      <StyledCard
        title={`${t('admin_title_stepper_family_doctor')} (${t('admin_inf_optional')})`}
        subtitle={t('admin_title_stepper_enter_information_about_family_doctor')}
      >
        <FamilyDoctor />
      </StyledCard>
      <PromptModal
        open={isModalOpen}
        title={t('admin_title_supporting_contacts_added')}
        notificationContent={{
          description: t('admin_inf_supporting_contacts_added_subtitle'),
        }}
        cancelButtonText={t('admin_btn_finish')}
        confirmButtonText={t('admin_btn_proceed_to_assessment')}
        confirmButtonType="primary"
        onCancel={() => handleModalConfirmation(PathRoutes.SeniorProfile)}
        onConfirm={() => handleModalConfirmation(PathRoutes.SeniorAddEntry)}
      />
      <FormButtons onConfirm={toggleModal} confirmButtonText={t('shared_btn_save')} />
    </div>
  );
};

export default SeniorSupportingContacts;
