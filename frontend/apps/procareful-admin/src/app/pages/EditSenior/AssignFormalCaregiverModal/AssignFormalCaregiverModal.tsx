import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Trans } from 'react-i18next';
import { type z } from 'zod';
import { Form, Select, type SelectProps } from 'antd';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import { PaginationSize } from '@ProcarefulAdmin/constants';
import { assignNewCaregiverSchema } from '@ProcarefulAdmin/utils';
import {
  getAdminInstitutionControllerGetFormalCaregiversAvailableForUserQueryKey,
  getAdminInstitutionControllerGetUserByIdQueryKey,
  type GetInformalCaregiversDto,
  useAdminInstitutionControllerAssignFormalCaregiverToSenior,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph } from '@Procareful/ui';
import { FORMAL_CAREGIVERS_PAGINATION_PARAMS } from '../constants';
import { useStyles } from './styles';

type CaregiverData = z.infer<typeof assignNewCaregiverSchema>;

type AssignFormalCaregiverModalProps = {
  seniorId: number;
  caregivers: GetInformalCaregiversDto[];
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};
const AssignFormalCaregiverModal = ({
  seniorId,
  caregivers,
  isOpen,
  onSuccess,
  onCancel,
}: AssignFormalCaregiverModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<CaregiverData>({
    values: { id: undefined },
    resolver: zodResolver(assignNewCaregiverSchema),
  });

  const { mutate: assignSeniorToFormalCaregiver, isPending } =
    useAdminInstitutionControllerAssignFormalCaregiverToSenior({
      mutation: {
        onSuccess: (_, { caregiverId }) => {
          const selectedCaregiver = caregivers.find(
            (caregiver: GetInformalCaregiversDto) => caregiver.id === caregiverId
          );

          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetUserByIdQueryKey(seniorId, {
              page: 1,
              pageSize: PaginationSize.Small,
            }),
          });

          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetFormalCaregiversAvailableForUserQueryKey(
              seniorId,
              FORMAL_CAREGIVERS_PAGINATION_PARAMS
            ),
          });
          notificationApi.success({
            message: t('admin_alert_new_caregiver_assigned_title'),
            description: (
              <Trans>
                {t('admin_alert_new_caregiver_assigned_subtitle', {
                  caregiverName: `${selectedCaregiver?.first_name} ${selectedCaregiver?.last_name}`,
                })}
              </Trans>
            ),
          });
          reset();
          onSuccess();
        },
      },
    });

  const formalCaregiversItems = caregivers?.map(
    ({ id, first_name, last_name }: GetInformalCaregiversDto) => ({
      label: `${first_name} ${last_name}`,
      value: id,
    })
  );

  const onSubmit: SubmitHandler<CaregiverData> = ({ id }) => {
    if (!id) {
      return;
    }

    assignSeniorToFormalCaregiver({
      caregiverId: id,
      userId: seniorId,
    });
  };

  const filterOption: SelectProps['filterOption'] = (input, option) =>
    ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <PromptModal
      open={isOpen}
      title={t('admin_title_adding_new_caregiver')}
      notificationContent={{ description: t('admin_inf_adding_new_caregiver_subtitle') }}
      onConfirm={handleSubmit(onSubmit)}
      onCancel={onCancel}
      confirmButtonType="primary"
      confirmButtonText={t('admin_btn_assign_caregiver')}
      isLoading={isPending}
    >
      <Paragraph>{t('admin_inf_adding_new_caregiver_additional_info')}</Paragraph>
      <Form>
        <FormItem name="id" control={control}>
          <Select
            showSearch
            className={styles.select}
            options={formalCaregiversItems}
            placeholder={t('admin_form_type_caregiver_name')}
            filterOption={filterOption}
          />
        </FormItem>
      </Form>
    </PromptModal>
  );
};

export default AssignFormalCaregiverModal;
