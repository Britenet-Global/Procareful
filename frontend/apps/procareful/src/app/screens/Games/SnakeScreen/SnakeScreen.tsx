import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  GAME_NAME,
  useToggle,
  saveGameResult,
  SearchParams,
} from '@Procareful/common/lib';
import { useSnakeGame } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useNavigate } from 'react-router-dom';
import ExitGameModal from '../ExitGameModal';

const SnakeScreen = () => {
  const { showTutorial, points, renderSnakeGame, handleTutorialIconClick, difficultyLevel } =
    useSnakeGame();
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    saveGameResult({
      name: AddGameScoreDtoGameName.snake,
      points: points,
      status: 'aborted',
      difficultyLevel,
    });

    navigate({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.snake.toString(),
      }).toString(),
    });
  };

  const handleTopBarClose = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    setExitGameModalVisibility(true);
  };

  return (
    <TopBarLayout
      screenTitle={GAME_NAME.Snake}
      showTutorialIcon={!showTutorial}
      onTutorialIconClick={handleTutorialIconClick}
      type="close"
      onClick={handleTopBarClose}
    >
      {renderSnakeGame()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default SnakeScreen;
