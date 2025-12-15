export class GetDocumentsDto {
  id: number;
  created_at: Date;
  name: string;
  unique_name: string;
  added_by?: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    phone_number: string;
    email_address: string;
    date_of_birth: Date;
    deleted_at?: string;
    image_name?: string;
    first_login: boolean;
  } | null;
}
