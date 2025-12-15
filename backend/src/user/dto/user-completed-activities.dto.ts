class Activity {
  name: string;
  completed: boolean;
}

export class UserCompletedActivitiesDto {
  activities: Activity[];
  totalActivities: number;
  completedActivities: number;
}
