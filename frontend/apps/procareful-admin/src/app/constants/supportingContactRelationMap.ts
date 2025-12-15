import { AddSupportingContactDtoRelationItem } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const seniorRelationMap = {
  get [AddSupportingContactDtoRelationItem.emergencyContact]() {
    return i18n.t('admin_title_emergency_contact');
  },
  get [AddSupportingContactDtoRelationItem.informalCaregiver]() {
    return i18n.t('admin_title_informal_caregiver');
  },
  get [AddSupportingContactDtoRelationItem.legalRepresentative]() {
    return i18n.t('admin_title_legal_representative');
  },
  get [AddSupportingContactDtoRelationItem.other]() {
    return i18n.t('admin_title_caregiver_role_other');
  },
};
