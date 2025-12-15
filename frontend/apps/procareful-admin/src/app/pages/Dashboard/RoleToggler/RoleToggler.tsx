import { Radio, type RadioChangeEvent } from 'antd';
import { AdminRolesDtoRoleName } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { type InstitutionAdminAndFormalCaregiver } from '../Dashboard';
import { useStyles } from './styles';

type RoleTogglerProps = {
  value: InstitutionAdminAndFormalCaregiver;
  onChange: (e: RadioChangeEvent) => void;
};

const RoleToggler = ({ value, onChange }: RoleTogglerProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.togglerContainer}>
      <Radio.Group
        defaultValue={AdminRolesDtoRoleName.adminInstitution}
        size="small"
        onChange={onChange}
        value={value}
      >
        <Radio.Button value={AdminRolesDtoRoleName.adminInstitution}>
          {t('admin_btn_institution_view')}
        </Radio.Button>
        <Radio.Button value={AdminRolesDtoRoleName.formalCaregiver}>
          {t('admin_btn_caregiver_view')}
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default RoleToggler;
