export class UserDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  phone_number: string;
  email_address: string;
}
