import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Checkbox } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import InfoTile from '@ProcarefulAdmin/components/InfoTile';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import { useToggle, useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Paragraph, Text } from '@Procareful/ui';
import { getContentByAssessmentStatus } from './helpers';
import { useStyles } from './styles';

const AddSeniorEntry = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalOpen, toggleModal] = useToggle();
  const [hasAcknowledgedNotification, setHasAcknowledgedNotification] = useState(false);
  useOnboardingStepComplete();

  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const seniorId = searchParams.get(SearchParams.Id);
  const isSeniorConditionAssessment = Boolean(seniorId);
  const { title, subtitle, info } = getContentByAssessmentStatus(isSeniorConditionAssessment);

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
      <StyledCard className={styles.cardContainer} title={title}>
        <div className={styles.subtitle}>
          <Paragraph>{subtitle}</Paragraph>
          <Paragraph>{info}</Paragraph>
        </div>
        <div>
          <Text className={styles.beforeStart} strong>
            {t('admin_title_before_you_start')}
          </Text>
          <div>
            <InfoTile
              variant="div"
              title={t('admin_title_have_your_senior_with_you')}
              subtitle={t('admin_inf_have_your_senior_with_you_subtitle')}
              index={1}
              containerStyle={styles.tileInfoContainer}
            />
            <InfoTile
              variant="div"
              title={t('admin_title_prepare_for_moca')}
              subtitle={t('admin_inf_prepare_for_moca_subtitle')}
              index={2}
              containerStyle={styles.tileInfoContainer}
            >
              <Link className={styles.getMocaButton} to={PathRoutes.Support}>
                {t('admin_btn_get_printable_moca_questionnaire')}
              </Link>
            </InfoTile>
            {isSeniorConditionAssessment && (
              <InfoTile
                variant="div"
                title={t('admin_title_condition_assessment_questionnaires')}
                subtitle={t('admin_inf_have_your_senior_with_you_subtitle')}
                index={3}
                containerStyle={styles.tileInfoContainer}
              >
                <ul className={styles.listContainer}>
                  <li>MOCA</li>
                  <li>IPAQ</li>
                  <li>{t('admin_inf_questionnaire_dejong_gierveld_scale')}</li>
                  <li>EQ-5D-5L</li>
                  <li>{t('admin_inf_questionnaire_pittsburher_sleep_quality_index')}</li>
                </ul>
              </InfoTile>
            )}
          </div>
        </div>
      </StyledCard>
      {!isSeniorConditionAssessment && (
        <StyledCard
          title={t('admin_title_important_notice')}
          className={cx(styles.cardContainer, styles.cardContainerWithBiggerMargin)}
        >
          <Paragraph className={styles.importantNoticeSubtitle}>
            {t('admin_inf_important_notice_subtitle')}
          </Paragraph>
          <Checkbox onChange={() => setIsAgreementChecked(currentValue => !currentValue)}>
            {t('admin_form_senior_full_access_after_form_completion')}
          </Checkbox>
        </StyledCard>
      )}
      <PromptModal
        open={isModalOpen}
        title={t('admin_title_important_notice')}
        notificationContent={{
          description: t('admin_inf_form_must_be_completed_in_one_take'),
        }}
        cancelButtonText={t('admin_btn_finish')}
        confirmButtonText={t('admin_btn_proceed_to_assessment')}
        confirmButtonDisabled={!hasAcknowledgedNotification}
        onConfirm={() => handleModalConfirmation(PathRoutes.SeniorAddConditionAssessment)}
        onCancel={toggleModal}
        confirmButtonType="primary"
      >
        <Checkbox onChange={() => setHasAcknowledgedNotification(currentValue => !currentValue)}>
          {t('admin_form_i_understand')}
        </Checkbox>
      </PromptModal>
      <FormControls
        onReset={() =>
          isSeniorConditionAssessment
            ? handleModalConfirmation(PathRoutes.SeniorProfile)
            : navigate(-1)
        }
        onSubmit={() =>
          isSeniorConditionAssessment ? toggleModal() : navigate(PathRoutes.SeniorAddPersonalInfo)
        }
        resetButtonText={
          isSeniorConditionAssessment ? t('admin_btn_will_do_it_later') : t('shared_btn_cancel')
        }
        confirmButtonText={t('admin_btn_start_assessment')}
        isConfirmDisabled={isSeniorConditionAssessment ? false : !isAgreementChecked}
        containerClassName={styles.startAssessmentButton}
      />
    </div>
  );
};

export default AddSeniorEntry;
