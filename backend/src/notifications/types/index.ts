export enum ENotificationType {
  IN_APP = 'in_app',
  EMAIL = 'email',
}

export enum ENotificationTitle {
  PERFORMANCE_DECLINE = 'performance_decline',
  USER_INACTIVE_7_DAYS = 'user_inactive_for_7_plus_days',
  MONITORING_VISIT_REQUEST = 'monitoring_visit_request',
  NEW_SENIOR_ASSIGNED = 'new_senior_assigned',
  NEW_INFORMAL_CAREGIVER_ASSIGNED = 'new_informal_caregiver_assigned_to_senior',
  NEW_FORMAL_CAREGIVER_ASSIGNED = 'new_formal_caregiver_assigned_to_senior',
  USER_COMPLETED_DAILY_ASSIGNMENT = 'user_completed_their_daily_assignment',
  NEW_NOTE_ADDED = 'new_note_added',
  NEW_DOCUMENT_UPLOADED = 'new_document_uploaded',
  NEW_CARE_PLAN_ASSIGNED = 'new_care_plan_assigned',
  NEW_CARE_PLAN_CHANGED = 'new_care_plan_changed',
  ROLE_UPDATED = 'role_updated',
}

export enum ENotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
export type TMessageEvent = {
  data: string | object;
};

export type TEventData = {
  adminId: number;
  title: string;
};
