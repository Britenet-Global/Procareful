import NotificationsCenter from '@ProcarefulAdmin/pages/NotificationsCenter';
import ActiveSeniorsList from './ActiveSeniorsList';
import CognitiveGamesChart from './CognitiveGamesChart';
import { useStyles } from './styles';

const FormalCaregiverDashboard = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <section className={styles.cognitiveGamesEngagementContainer}>
        <CognitiveGamesChart />
      </section>
      <section className={styles.mostActiveSeniorsContainer}>
        <ActiveSeniorsList />
      </section>
      <section className={styles.notificationCenterContainer}>
        <NotificationsCenter />
      </section>
    </div>
  );
};
export default FormalCaregiverDashboard;
