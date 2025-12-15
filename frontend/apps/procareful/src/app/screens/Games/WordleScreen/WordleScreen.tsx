import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  GAME_NAME,
  SearchParams,
  saveGameResult,
  useToggle,
} from '@Procareful/common/lib';
import { useWordleGame } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useNavigate } from 'react-router-dom';
import ExitGameModal from '../ExitGameModal';

const WordleScreen = () => {
  const { showTutorial, toggleTutorialModal, renderWordleGame, points, difficultyLevel } =
    useWordleGame();
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    saveGameResult({
      name: AddGameScoreDtoGameName.wordle,
      points,
      status: 'aborted',
      difficultyLevel,
    });

    navigate({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.wordle,
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
      onTutorialIconClick={toggleTutorialModal}
      onClick={handleTopBarClose}
      screenTitle={GAME_NAME.Wordle}
      type="close"
    >
      {renderWordleGame()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default WordleScreen;
