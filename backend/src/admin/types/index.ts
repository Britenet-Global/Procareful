import { Role } from '../entities';

export enum EStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CREATED = 'created',
}

export enum ERole {
  HEAD_ADMIN = 'headAdmin',
  SUPER_ADMIN_INSTITUTION = 'superAdminInstitution',
  ADMIN_INSTITUTION = 'adminInstitution',
  FORMAL_CAREGIVER = 'formalCaregiver',
  INFORMAL_CAREGIVER = 'informalCaregiver',
  ADMIN_ML = 'adminML',
}

export enum ELanguage {
  ENGLISH = 'EN',
  GERMAN = 'DE',
  POLISH = 'PL',
  ITALIAN = 'IT',
  HUNGARIAN = 'HU',
  CROATIAN = 'HR',
  SLOVENIAN = 'SI',
}

export enum EContactType {
  SUPPORTING = 'supporting',
  DOCTOR = 'doctor',
}

export enum ERelationshipToSenior {
  INFORMAL_CAREGIVER = 'informalCaregiver',
  EMERGENCY = 'emergencyContact',
  LEGAL_REPRESENTATIVE = 'legalRepresentative',
  OTHER = 'other',
}

export type TRoleValidationFunction = (
  targetRoles: Role[],
  adminInstitutionId?: number,
  targetInstitutionId?: number,
) => boolean;

export type TGetTranslations = {
  translation: {
    assessment_report: {
      keys: Record<string, string>;
    };
  };
};
