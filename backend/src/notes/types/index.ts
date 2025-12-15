export enum ENoteCategory {
  MEDICAL_HISTORY = 'medical_history',
  MONITORING_VISIT_REQUEST = 'monitoring_visit_request',
  REQUIRED_PURCHASES = 'required_purchases',
  MEDICAL_CONSULTATION_REQUIRED = 'medical_consultation_required',
  OTHER_SERVICES_REQUIRED = 'other_services_required',
}

export type FileArray = {
  files?: Express.Multer.File[];
  notes?: string;
};

export type TDownloadNoteAttachment = {
  attachment: Buffer;
  name: string;
  extension: string;
};
