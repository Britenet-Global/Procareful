import {
  AddGameScoreDtoGameName,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  GAME_NAME,
  useToggle,
  saveGameResult,
  SearchParams,
} from '@Procareful/common/lib';
import { GameResult, useTicTacToeGame } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import ExitGameModal from '@ProcarefulApp/screens/Games/ExitGameModal';
import { useNavigate } from 'react-router-dom';

const TicTacToeScreen = () => {
  const {
    showTutorial,
    renderTicTacToeGame,
    handleTutorialIconClick,
    clearState,
    points,
    progress,
    gameConfig,
    pointsEarnWhenWonExpectedNumberOfGames,
    difficultyLevel,
  } = useTicTacToeGame();
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();

  const { mutate: sendPoints } = useUserControllerUpdateBrainPoints();

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }
    const numberOfWins = progress?.filter(p => p.status === GameResult.WON)?.length;
    const hasWon = numberOfWins >= gameConfig.numberOfGamesToWin;

    if (hasWon) {
      sendPoints({
        data: {
          points: pointsEarnWhenWonExpectedNumberOfGames,
        },
      });
    }

    clearState();
    saveGameResult({
      name: AddGameScoreDtoGameName.tic_tac_toe,
      points: hasWon ? points + pointsEarnWhenWonExpectedNumberOfGames : points,
      status: 'aborted',
      difficultyLevel,
    });

    navigate({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.tic_tac_toe.toString(),
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
      screenTitle={GAME_NAME.TicTacToe}
      type="close"
    >
      {renderTicTacToeGame()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default TicTacToeScreen;
