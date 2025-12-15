import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import FormalCaregiversTable from './FormalCaregiversTable';
import InformalCaregiversTable from './InformalCaregiversTable';
import SeniorsTable from './SeniorsTable';
import { useStyles } from './styles';

const InstitutionUsers = () => {
  const { styles } = useStyles();

  useOnboardingStepComplete();

  return (
    <div className={styles.container}>
      <SeniorsTable />
      <InformalCaregiversTable />
      <FormalCaregiversTable />
    </div>
  );
};

export default InstitutionUsers;
