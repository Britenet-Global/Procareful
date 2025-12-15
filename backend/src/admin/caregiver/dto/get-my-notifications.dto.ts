import { ENotificationPriority, ENotificationTitle } from 'src/notifications/types';

export class GetMyNotificationsDto {
  id: number;
  created_at: Date;
  date_of_email_sending: Date;
  notification_in_app: boolean;
  notification_by_email: boolean;
  displayed: boolean;
  title: ENotificationTitle;
  priority: ENotificationPriority;
  admin: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    phone_number: string;
    email_address: string;
    date_of_birth: string;
    deleted_at?: string;
    image_name?: string;
  };
  user: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    email_address: string;
    image_name?: string;
  };
}
