import { ProcarefulAppPathRoutes } from '@Procareful/common/lib';
import Dashboard from '@ProcarefulApp/screens/Dashboard';
import Diary from '@ProcarefulApp/screens/Diary';
import DiaryDetails from '@ProcarefulApp/screens/DiaryDetails';
import GameFeedback from '@ProcarefulApp/screens/GameFeedback';
import Games from '@ProcarefulApp/screens/Games';
import Game2048Screen from '@ProcarefulApp/screens/Games/Game2048Screen';
import MemoryScreen from '@ProcarefulApp/screens/Games/MemoryScreen';
import SnakeScreen from '@ProcarefulApp/screens/Games/SnakeScreen';
import SudokuScreen from '@ProcarefulApp/screens/Games/SudokuScreen';
import TicTacToeScreen from '@ProcarefulApp/screens/Games/TicTacToeScreen';
import WordGuessScreen from '@ProcarefulApp/screens/Games/WordGuessScreen';
import WordleScreen from '@ProcarefulApp/screens/Games/WordleScreen';
import LoginMethod from '@ProcarefulApp/screens/LoginMethod';
import LoginSecurityAlert from '@ProcarefulApp/screens/LoginSecurityAlert';
import LoginWithEmail from '@ProcarefulApp/screens/LoginWithEmail';
import LoginWithEmailConfirmationCode from '@ProcarefulApp/screens/LoginWithEmailConfirmationCode';
import LoginWithPhone from '@ProcarefulApp/screens/LoginWithPhone';
import LoginWithPhoneConfirmationCode from '@ProcarefulApp/screens/LoginWithPhoneConfirmationCode';
import Logout from '@ProcarefulApp/screens/Logout';
import Onboarding from '@ProcarefulApp/screens/Onboarding';
import PersonalGrowth from '@ProcarefulApp/screens/PersonalGrowth';
import PhysicalActivity from '@ProcarefulApp/screens/PhysicalActivity';
import PhysicalActivityDetails from '@ProcarefulApp/screens/PhysicalActivityDetails';
import Settings from '@ProcarefulApp/screens/Setttings';
import VideoView from '@ProcarefulApp/screens/VideoView';

export const publicRoutes = [
  {
    path: ProcarefulAppPathRoutes.LoginMethod,
    element: <LoginMethod />,
  },
  {
    path: ProcarefulAppPathRoutes.LoginWithEmail,
    element: <LoginWithEmail />,
  },
  {
    path: ProcarefulAppPathRoutes.LoginWithEmailConfirmationCode,
    element: <LoginWithEmailConfirmationCode />,
  },
  {
    path: ProcarefulAppPathRoutes.LoginWithPhone,
    element: <LoginWithPhone />,
  },
  {
    path: ProcarefulAppPathRoutes.LoginWithPhoneConfirmationCode,
    element: <LoginWithPhoneConfirmationCode />,
  },
  {
    path: ProcarefulAppPathRoutes.LoginSecurityAlert,
    element: <LoginSecurityAlert />,
  },
];

export const protectedRoutes = [
  {
    path: ProcarefulAppPathRoutes.Onboarding,
    element: <Onboarding />,
  },
  {
    path: ProcarefulAppPathRoutes.Dashboard,
    element: <Dashboard />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesStartYourDay,
    element: <PhysicalActivity />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesStayActive,
    element: <PhysicalActivity />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesExercises,
    element: <PhysicalActivity />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesBreathing,
    element: <PhysicalActivity />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesDawnDeepBreaths,
    element: <PhysicalActivity />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesTwilightBreaths,
    element: <PhysicalActivity />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivitiesWalking,
    element: <PhysicalActivityDetails />,
  },
  {
    path: ProcarefulAppPathRoutes.MyDiary,
    element: <Diary />,
  },
  {
    path: ProcarefulAppPathRoutes.MyDiaryDetails,
    element: <DiaryDetails />,
  },
  {
    path: ProcarefulAppPathRoutes.PersonalGrowth,
    element: <PersonalGrowth />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivityDetails,
    element: <PhysicalActivityDetails />,
  },
  {
    path: ProcarefulAppPathRoutes.PhysicalActivityDetailsVideo,
    element: <VideoView />,
  },
  {
    path: ProcarefulAppPathRoutes.Games,
    element: <Games />,
  },
  {
    path: ProcarefulAppPathRoutes.Sudoku,
    element: <SudokuScreen />,
  },
  {
    path: ProcarefulAppPathRoutes.Tic_tac_toe,
    element: <TicTacToeScreen />,
  },
  {
    path: ProcarefulAppPathRoutes.Memory,
    element: <MemoryScreen />,
  },
  {
    path: ProcarefulAppPathRoutes.Snake,
    element: <SnakeScreen />,
  },
  {
    path: ProcarefulAppPathRoutes.Word_guess,
    element: <WordGuessScreen />,
  },
  {
    path: ProcarefulAppPathRoutes.Wordle,
    element: <WordleScreen />,
  },
  {
    path: ProcarefulAppPathRoutes.Game_2048,
    element: <Game2048Screen />,
  },
  {
    path: ProcarefulAppPathRoutes.GameFeedback,
    element: <GameFeedback />,
  },
  { path: ProcarefulAppPathRoutes.Logout, element: <Logout /> },
  {
    path: ProcarefulAppPathRoutes.Settings,
    element: <Settings />,
  },
];
