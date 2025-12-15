import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import type { z } from 'zod';
import { Form, Modal } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import { CarePlanEditParams, reasonOfUpdateCarePlanOptions } from '@ProcarefulAdmin/constants';
import { reasonOfUpdatingCarePlanSchema } from '@ProcarefulAdmin/utils';
import {
  EditCarePlanReasonDtoEditCarePlanReason,
  useCaregiverControllerEditCarePlanReason,
  type ErrorResponse,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { FormBuilder, Text } from '@Procareful/ui';
import { useStyles } from './styles';

type EditCarePlanModalProps = {
  isVisible: boolean;
  toggleModal: () => void;
  onConfirm?: () => void;
};

type ReasonOfUpdateCarePlan = z.infer<typeof reasonOfUpdatingCarePlanSchema>;

const EditCarePlanModal = ({ isVisible, toggleModal }: EditCarePlanModalProps) => {
  const { styles } = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTypedTranslation();
  const seniorId = searchParams.get(SearchParams.Id);

  const { control, handleSubmit, reset, setError } = useForm<ReasonOfUpdateCarePlan>({
    resolver: zodResolver(reasonOfUpdatingCarePlanSchema),
  });

  const { mutate: handleEditCarePlanReason, isPending } = useCaregiverControllerEditCarePlanReason({
    mutation: {
      onSuccess: (_, { data }) => {
        reset();
        searchParams.delete(SearchParams.Step);
        const searchParamsToSet =
          data.edit_care_plan_reason ===
          EditCarePlanReasonDtoEditCarePlanReason.seniors_condition_has_changed
            ? CarePlanEditParams.SeniorConditionChanged
            : CarePlanEditParams.UpdateCarePlan;
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set(SearchParams.Step, searchParamsToSet);
        setSearchParams(nextSearchParams, { replace: true });
      },
      onError: (error: ErrorResponse) => {
        setBackendFieldErrors(error, setError);
      },
    },
  });

  const handleFormSubmit: SubmitHandler<ReasonOfUpdateCarePlan> = ({ updateCarePlanReason }) => {
    if (!seniorId) {
      return;
    }

    handleEditCarePlanReason({
      userId: Number(seniorId),
      data: { edit_care_plan_reason: updateCarePlanReason },
    });
  };

  const handleCloseModal = () => {
    reset();
    toggleModal();
  };

  return (
    <Modal
      title={t('admin_title_edit_care_plan')}
      centered
      maskClosable={false}
      open={isVisible}
      className={styles.modal}
      footer={null}
      onCancel={handleCloseModal}
      keyboard={false}
    >
      <Form onFinish={handleSubmit(handleFormSubmit)} layout="vertical">
        <Text>{t('admin_inf_edit_care_plan')}</Text>
        <FormBuilder.RadioGroupItem
          label={t('admin_inf_what_is_the_reason_for_updating_care_plan')}
          options={reasonOfUpdateCarePlanOptions}
          control={control}
          name="updateCarePlanReason"
          className={styles.labelMargin}
        />
        <FormControls
          confirmButtonText={t('admin_btn_confirm')}
          resetButtonText={t('admin_btn_close')}
          onReset={handleCloseModal}
          loading={isPending}
        />
      </Form>
    </Modal>
  );
};

export default EditCarePlanModal;
