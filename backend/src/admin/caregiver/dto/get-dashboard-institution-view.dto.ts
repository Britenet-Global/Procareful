class CaregiverWorkloadDto {
  id: number;
  seniorCount: number;
  imageName: string;
  name: string;
  image: string | null;
}

export class GetDashboardInstitutionViewDto {
  seniors: number;
  informalCaregivers: number;
  formalCaregivers: number;
  rolesDistribution: {
    social_worker: number;
    health_care_professional: number;
    care_worker: number;
    volunteer: number;
    psychologist: number;
    socialization_coordinator: number;
    informal_caregiver: number;
    other: number;
  };
  caregiversWorkload: CaregiverWorkloadDto[];
}
