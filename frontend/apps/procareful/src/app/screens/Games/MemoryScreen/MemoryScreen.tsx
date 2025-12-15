import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  GAME_NAME,
  SearchParams,
  saveGameResult,
  useToggle,
} from '@Procareful/common/lib';
import { useMemoryGame } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useNavigate } from 'react-router-dom';
import ExitGameModal from '../ExitGameModal';

const MemoryScreen = () => {
  const { showTutorial, points, handleTutorialIconClick, renderMemoryGame, difficultyLevel } =
    useMemoryGame();
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    saveGameResult({
      name: AddGameScoreDtoGameName.memory,
      points,
      status: 'aborted',
      difficultyLevel,
    });

    navigate({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.memory.toString(),
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
      showTutorialIcon={!showTutorial}
      onTutorialIconClick={handleTutorialIconClick}
      onClick={handleTopBarClose}
      screenTitle={GAME_NAME.Memory}
      type="close"
    >
      {renderMemoryGame()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default MemoryScreen;
