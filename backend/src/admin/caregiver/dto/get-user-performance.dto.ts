export class GetUserPerformance {
  cognitiveGames: number;
  physicalActivity: number;
  personalGrowth: null | {
    personalGrowthAllChallenges: number;
    personalGrowthCompletedChallenges: number;
  };
  totalPerformance: number;
  assignedCarePlan: boolean;
}
