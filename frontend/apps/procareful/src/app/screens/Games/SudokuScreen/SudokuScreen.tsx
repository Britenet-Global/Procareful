import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import { saveGameResult, useToggle } from '@Procareful/common/lib';
import { GAME_NAME, ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib/constants';
import { useSudokuGame } from '@Procareful/games';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useNavigate } from 'react-router-dom';
import ExitGameModal from '../ExitGameModal';

const SudokuScreen = () => {
  const navigate = useNavigate();
  const [isExitModalVisible, , setExitGameModalVisibility] = useToggle();
  const { showTutorial, renderSudokuGame, handleTutorialIconClick, points, difficultyLevel } =
    useSudokuGame();

  const handleGameStopConfirmation = () => {
    if (showTutorial) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    saveGameResult({
      name: AddGameScoreDtoGameName.sudoku,
      points,
      status: 'aborted',
      difficultyLevel,
    });

    navigate({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.sudoku.toString(),
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
      screenTitle={GAME_NAME.Sudoku}
      type="close"
    >
      {renderSudokuGame()}
      <ExitGameModal
        open={isExitModalVisible}
        onConfirm={() => setExitGameModalVisibility(false)}
        onCancel={handleGameStopConfirmation}
      />
    </TopBarLayout>
  );
};

export default SudokuScreen;
