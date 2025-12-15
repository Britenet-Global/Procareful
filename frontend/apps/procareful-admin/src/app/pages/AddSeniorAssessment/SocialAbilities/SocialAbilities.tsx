import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Form, Radio } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import {
  type SocialAbilitiesData,
  useSeniorAssessmentStore,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { socialAbilitiesSchema } from '@ProcarefulAdmin/utils';
import {
  AddSocialAbilitiesDtoEnoughPeopleFeelClose,
  AddSocialAbilitiesDtoExperienceOfEmptiness,
  AddSocialAbilitiesDtoFeelRejected,
  AddSocialAbilitiesDtoMissHavingPeopleAround,
  AddSocialAbilitiesDtoRelyOnPeople,
  AddSocialAbilitiesDtoTrustCompletely,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import CardTitle from '../CardTitle';
import FormButtons from '../FormButtons';

const SocialAbilities = () => {
  const { t } = useTypedTranslation();
  const stylish = useStylish();

  const { goToNextStep, formDetails, setSeniorAssessmentDetails } = useSeniorAssessmentStore(
    state => ({
      goToNextStep: state.goToNextStep,
      formDetails: state.formDetails,
      setSeniorAssessmentDetails: state.setSeniorAssessmentDetails,
    })
  );

  const { control, handleSubmit } = useForm<SocialAbilitiesData>({
    resolver: zodResolver(socialAbilitiesSchema),
    defaultValues: formDetails,
  });

  const formItemCommonProps = {
    control,
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const onSubmit: SubmitHandler<SocialAbilitiesData> = formData => {
    setSeniorAssessmentDetails(formData);
    goToNextStep();
  };

  return (
    <div className={stylish.container}>
      <StyledCard
        title={<CardTitle>{t('admin_title_stepper_social_abilities')}</CardTitle>}
        subtitle={t('admin_inf_social_abilities_subtitle')}
        className={stylish.cardContainer}
      >
        <Form layout="vertical" className={stylish.form} onFinish={handleSubmit(onSubmit)}>
          <ol>
            <li>
              <FormItem
                label={t('admin_form_experience_of_emptiness')}
                name="experienceOfEmptiness"
                {...formItemCommonProps}
              >
                <Radio.Group>
                  <div className={stylish.radioGroup}>
                    <Radio value={AddSocialAbilitiesDtoExperienceOfEmptiness.yes}>
                      {t('admin_btn_yes')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoExperienceOfEmptiness.more_or_less}>
                      {t('admin_btn_more_or_less')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoExperienceOfEmptiness.no}>
                      {t('admin_btn_no')}
                    </Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
            <li>
              <FormItem
                label={t('admin_form_miss_having_people_around')}
                name="missHavingPeopleAround"
                {...formItemCommonProps}
              >
                <Radio.Group>
                  <div className={stylish.radioGroup}>
                    <Radio value={AddSocialAbilitiesDtoMissHavingPeopleAround.yes}>
                      {t('admin_btn_yes')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoMissHavingPeopleAround.more_or_less}>
                      {t('admin_btn_more_or_less')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoMissHavingPeopleAround.no}>
                      {t('admin_btn_no')}
                    </Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
            <li>
              <FormItem
                label={t('admin_form_feel_rejected')}
                name="feelRejected"
                {...formItemCommonProps}
              >
                <Radio.Group>
                  <div className={stylish.radioGroup}>
                    <Radio value={AddSocialAbilitiesDtoFeelRejected.yes}>
                      {t('admin_btn_yes')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoFeelRejected.more_or_less}>
                      {t('admin_btn_more_or_less')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoFeelRejected.no}>{t('admin_btn_no')}</Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
            <li>
              <FormItem
                label={t('admin_form_rely_on_people')}
                name="relyOnPeople"
                {...formItemCommonProps}
              >
                <Radio.Group>
                  <div className={stylish.radioGroup}>
                    <Radio value={AddSocialAbilitiesDtoRelyOnPeople.yes}>
                      {t('admin_btn_yes')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoRelyOnPeople.more_or_less}>
                      {t('admin_btn_more_or_less')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoRelyOnPeople.no}>{t('admin_btn_no')}</Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
            <li>
              <FormItem
                label={t('admin_form_trust_completely')}
                name="trustCompletely"
                {...formItemCommonProps}
              >
                <Radio.Group>
                  <div className={stylish.radioGroup}>
                    <Radio value={AddSocialAbilitiesDtoTrustCompletely.yes}>
                      {t('admin_btn_yes')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoTrustCompletely.more_or_less}>
                      {t('admin_btn_more_or_less')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoTrustCompletely.no}>
                      {t('admin_btn_no')}
                    </Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
            <li>
              <FormItem
                label={t('admin_form_enough_people_feel_close')}
                name="enoughPeopleFeelClose"
                {...formItemCommonProps}
              >
                <Radio.Group>
                  <div className={stylish.radioGroup}>
                    <Radio value={AddSocialAbilitiesDtoEnoughPeopleFeelClose.yes}>
                      {t('admin_btn_yes')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoEnoughPeopleFeelClose.more_or_less}>
                      {t('admin_btn_more_or_less')}
                    </Radio>
                    <Radio value={AddSocialAbilitiesDtoEnoughPeopleFeelClose.no}>
                      {t('admin_btn_no')}
                    </Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
          </ol>
        </Form>
      </StyledCard>
      <FormButtons
        onConfirm={handleSubmit(onSubmit)}
        containerClassName={stylish.formButtonContainer}
      />
      <NavigationBlockerModal shouldBlock />
    </div>
  );
};

export default memo(SocialAbilities);
