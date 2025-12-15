import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import { saveGameResult, useToggle } from '@Procareful/common/lib';
import { GAME_NAME, ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib/constants';
import { useWordGuessGame } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useNavigate } from 'react-router-dom';
import ExitGameModal from '../ExitGameModal';

const WordGuessScreen = () => {
  const {
    showTutorial,
    renderWordGuessGame,
    handleTutorialIconClick,
    sendScores,
    currentScore,
    difficultyLevel,
  } = useWordGuessGame();
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    saveGameResult({
      name: AddGameScoreDtoGameName.word_guess,
      points: currentScore,
      status: 'aborted',
      difficultyLevel,
    });

    sendScores(true);

    navigate({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.word_guess,
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
      screenTitle={GAME_NAME.WordGuess}
      type="close"
    >
      {renderWordGuessGame()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default WordGuessScreen;
