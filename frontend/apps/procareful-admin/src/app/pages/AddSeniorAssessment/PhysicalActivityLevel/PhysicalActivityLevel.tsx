import { useSeniorAssessmentStore } from '@ProcarefulAdmin/store/seniorAssessmentStore';
import NoPhysicalIssuesForm from './NoPhysicalIssuesForm';
import PhysicalIssuesForm from './PhysicalIssuesForm';

export type PhysicalIssuesStatus = 'idle' | 'hasIssues' | 'noIssues';

const PhysicalActivityLevel = () => {
  const { showExtendedPhysicalActivityForm } = useSeniorAssessmentStore(state => ({
    showExtendedPhysicalActivityForm: state.showExtendedPhysicalActivityForm,
  }));

  if (showExtendedPhysicalActivityForm) {
    return <NoPhysicalIssuesForm />;
  }

  return <PhysicalIssuesForm />;
};

export default PhysicalActivityLevel;
