import {
  AddGameScoreDtoGameName,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import { saveGameResult, useToggle } from '@Procareful/common/lib';
import { GAME_NAME, ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib/constants';
import { useGame2048 } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useNavigate } from 'react-router-dom';
import ExitGameModal from '../ExitGameModal';

const Game2048Screen = () => {
  const {
    showTutorial,
    handleTutorialIconClick,
    renderGame2048,
    points,
    resetGame,
    difficultyLevel,
  } = useGame2048();
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();

  const { mutate: handleSendBrainPoints } = useUserControllerUpdateBrainPoints({
    mutation: {
      onSuccess: () => {
        saveGameResult({
          name: AddGameScoreDtoGameName.game_2048,
          points,
          status: 'aborted',
          difficultyLevel,
        });
        resetGame();
        navigate({
          pathname: ProcarefulAppPathRoutes.GameFeedback,
          search: new URLSearchParams({
            [SearchParams.Name]: AddGameScoreDtoGameName.game_2048.toString(),
          }).toString(),
        });
      },
    },
  });

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    handleSendBrainPoints({
      data: {
        points,
      },
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
      onTutorialIconClick={handleTutorialIconClick}
      showTutorialIcon={!showTutorial}
      screenTitle={GAME_NAME[2048]}
      onClick={handleTopBarClose}
      type="close"
    >
      {renderGame2048()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default Game2048Screen;
