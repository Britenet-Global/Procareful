import { useQueryClient } from '@tanstack/react-query';
import { Collapse, Spin } from 'antd';
import InfoTile from '@ProcarefulAdmin/components/InfoTile';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { type StepKeysOnly } from '@ProcarefulAdmin/typings';
import {
  type GetMeResponseDto,
  type GetOnboardingDto,
  getAuthControllerGetMeQueryKey,
} from '@Procareful/common/api';
import { SearchParams } from '@Procareful/common/lib';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PanelHeader from './PanelHeader';
import { checkOnboardingStatus, getOnboardingItemsBasedOnRole } from './helpers';
import { useStyles } from './styles';

type StepsDto = StepKeysOnly<GetOnboardingDto>;
type StepKey = keyof StepsDto;

type OnboardingProps = {
  steps: GetOnboardingDto;
  isLoading: boolean;
};

const Onboarding = ({ steps, isLoading }: OnboardingProps) => {
  const { styles, cx } = useStyles();
  const queryClient = useQueryClient();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const onboardingSteps = getOnboardingItemsBasedOnRole(userData?.details.admin.roles) || [];
  const currentSteps: boolean[] = Object.values(steps).filter(value => value !== null);
  const totalSteps = currentSteps.length;
  const { completedSteps, remainingSteps } = checkOnboardingStatus(currentSteps);
  const completionPercentage = Math.ceil((completedSteps / totalSteps) * 100);

  const panelContent = (
    <div className={styles.itemsContainer}>
      {onboardingSteps.map(({ id, stepOrder, redirectTo, ...otherProps }, index) => {
        const stepKey = `step${index + 1}` as StepKey;
        const stepCompletion = steps?.[stepKey];
        const completed = Boolean(stepCompletion);

        const redirectConfig = {
          pathname: redirectTo,
          search: new URLSearchParams({
            [SearchParams.StepOrder]: stepOrder,
          }).toString(),
        };

        if (stepCompletion !== null) {
          return (
            <InfoTile
              {...otherProps}
              redirectTo={redirectConfig}
              variant="link"
              index={index + 1}
              key={id}
              icon={completed ? <CheckCircleIcon className={styles.iconCompleted} /> : undefined}
              containerStyle={cx({ [styles.stepCompleted]: completed })}
            />
          );
        }

        return null;
      })}
    </div>
  );

  const items = [
    {
      key: '1',
      label: (
        <PanelHeader remainingSteps={remainingSteps} completionPercentage={completionPercentage} />
      ),
      children: isLoading ? (
        <div className={styles.loader}>
          <Spin />
        </div>
      ) : (
        panelContent
      ),
    },
  ];

  return (
    <section className={styles.container}>
      <StyledCard className={styles.cardContainer} withBorders={false}>
        <Collapse
          items={items}
          defaultActiveKey={['1']}
          expandIconPosition="end"
          bordered={false}
          className={styles.collapse}
          expandIcon={({ isActive }) =>
            isActive ? (
              <CloseIcon className={styles.icon} />
            ) : (
              <ExpandMoreIcon className={styles.icon} />
            )
          }
        />
      </StyledCard>
    </section>
  );
};

export default Onboarding;
