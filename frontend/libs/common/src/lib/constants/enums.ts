export enum SearchParams {
  Step = 'step',
  Name = 'name',
  PhoneNumber = 'phone-number',
  SetPassword = 'set-password',
  Id = 'id',
  StepOrder = 'step-order',
  Preview = 'preview',
  SignUpSuccess = 'sign-up-success',
  Edit = 'edit',
  Delete = 'delete',
  AssessmentId = 'assessmentId',
  SuperAdminId = 'superAdminId',
  PageTitle = 'pageTitle',
  IsCompleted = 'isCompleted',
  ExerciseType = 'exerciseType',
  PageSubtitle = 'pageSubtitle',
}

export const INPUT_PLACEHOLDERS = {
  PHONE_NUMBER: '000-000-000',
  VERIFICATION_CODE: '000-000',
};

export const EMPTY_VALUE_PLACEHOLDER = '--';
export const SECURITY_CODE_PLACEHOLDER = '***-***';

export enum LocalStorageKey {
  IsAuthenticated = 'isAuthenticated',
  UserBlockStartDate = 'userBlockStartDate',
  SecurityAlertData = 'securityAlertData',
  GeneratedCodeStartDate = 'generatedCodeStartDate',
  HasUserOnboarding = 'hasUserOnboarding',
  PersonalGrowthData = 'personalGrowthData',
  CompletedGameData = 'completedGameData',
  GameRate = 'gameRate',
  Role = 'role',
  CarePlanId = 'carePlanId',
  Language = 'language',
  SeniorFontSize = 'seniorFontSize',
}

export enum SessionStorageKey {
  Email = 'email',
  PhoneNumber = 'phoneNumber',
}

export enum TimeFormat {
  HH_MM = 'HH:mm',
  H_mm = 'H:mm',
  DATE_FORMAT = 'DD/MM/YYYY',
  FULL_DATE_TIME_SEPARATED_BY_SEMICOLON = 'YYYY-MM-DD; HH:mm:ss',
}
