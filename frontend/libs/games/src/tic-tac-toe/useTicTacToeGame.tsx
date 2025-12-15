import TicTacToeGif from '@ProcarefulGamesAssets/tictactoeGif.gif';
import { useTypedTranslation } from '@Procareful/common/lib';
import GameTutorialModal from '../components/GameTutorialModal';
import TutorialScreen from '../components/TutorialScreen';
import TicTacToe from './TicTacToe/TicTacToe';
import { POINTS_EARN_WHEN_WON_EXPECTED_NUMBER_OF_GAMES } from './constants';
import { useTicTacToeStore } from './store/ticTacToeStore';

const useTicTacToeGame = () => {
  const { t } = useTypedTranslation();
  const {
    showTutorial,
    setShowTutorial,
    showTutorialModal,
    setShowTutorialModal,
    clearState,
    points,
    progress,
    gameConfig,
    gameLevel,
  } = useTicTacToeStore(state => ({
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
    clearState: state.clearState,
    points: state.points,
    progress: state.progress,
    gameConfig: state.gameConfig,
    gameLevel: state.gameLevel,
  }));

  const handleTutorialIconClick = () => {
    setShowTutorialModal(true);
  };

  const handleGameTutorialModalClose = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const renderGameTutorialModal = () => (
    <GameTutorialModal
      open={showTutorialModal}
      tutorialGif={TicTacToeGif}
      description={t('senior_games_sudoku_tutorial_text')}
      onCloseButtonClick={handleGameTutorialModalClose}
    />
  );

  const renderTicTacToeGame = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          onPlayButtonClick={() => setShowTutorial(!showTutorial)}
          tutorialGif={TicTacToeGif}
          title={t('senior_games_tictactoe_tutorial_title')}
          description={t('senior_games_tictactoe_tutorial_text')}
        />
      ) : (
        <TicTacToe />
      )}
      {showTutorialModal && renderGameTutorialModal()}
    </>
  );

  return {
    showTutorial,
    renderTicTacToeGame,
    handleTutorialIconClick,
    clearState,
    points,
    progress,
    gameConfig,
    pointsEarnWhenWonExpectedNumberOfGames: POINTS_EARN_WHEN_WON_EXPECTED_NUMBER_OF_GAMES,
    difficultyLevel: gameLevel,
  };
};

export default useTicTacToeGame;
