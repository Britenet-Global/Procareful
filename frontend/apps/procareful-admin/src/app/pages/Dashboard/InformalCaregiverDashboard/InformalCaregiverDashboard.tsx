import NotificationsCenter from '@ProcarefulAdmin/pages/NotificationsCenter';
import GamesEngagementChart from './GamesEngagementChart';
import PerformanceOfSenior from './PerformanceOfSenior';
import { useStyles } from './styles';

const InformalCaregiverDashboard = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <section className={styles.cognitiveGamesEngagementContainer}>
        <GamesEngagementChart />
      </section>
      <section className={styles.seniorPerformanceContainer}>
        <PerformanceOfSenior />
      </section>
      <section className={styles.notificationCenterContainer}>
        <NotificationsCenter />
      </section>
    </div>
  );
};

export default InformalCaregiverDashboard;
