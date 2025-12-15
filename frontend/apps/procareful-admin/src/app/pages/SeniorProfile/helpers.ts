import { ContactRelationRelations, type GetSupportingContactDto } from '@Procareful/common/api';
import { BannerType, bannerConfig } from './constants';

export const getBannerToShow = (
  shouldShowAlertAssessment: boolean,
  shouldShowActivitiesAlert: boolean
) => {
  if (shouldShowAlertAssessment) {
    return bannerConfig[BannerType.NoAssessment];
  }

  if (shouldShowActivitiesAlert) {
    return bannerConfig[BannerType.NoActivities];
  }

  return null;
};

export const sortByInformalCaregiver = (contacts?: GetSupportingContactDto[]) =>
  contacts?.sort((a, b) => {
    const aHasInformalCaregiver = a.contact.relation?.some(
      rel => rel.relations === ContactRelationRelations.informalCaregiver
    );
    const bHasInformalCaregiver = b.contact.relation?.some(
      rel => rel.relations === ContactRelationRelations.informalCaregiver
    );

    if (aHasInformalCaregiver && !bHasInformalCaregiver) return -1;
    if (!aHasInformalCaregiver && bHasInformalCaregiver) return 1;

    return 0;
  });
