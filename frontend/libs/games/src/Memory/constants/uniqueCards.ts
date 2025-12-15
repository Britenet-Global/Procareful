import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CameraOutlinedIcon from '@mui/icons-material/CameraOutlined';
import ColorizeOutlinedIcon from '@mui/icons-material/ColorizeOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';
import EggAltOutlinedIcon from '@mui/icons-material/EggAltOutlined';
import EggOutlinedIcon from '@mui/icons-material/EggOutlined';
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import FilterVintageOutlinedIcon from '@mui/icons-material/FilterVintageOutlined';
import FlareOutlinedIcon from '@mui/icons-material/FlareOutlined';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import HouseSidingOutlinedIcon from '@mui/icons-material/HouseSidingOutlined';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import SportsBaseballOutlinedIcon from '@mui/icons-material/SportsBaseballOutlined';
import SportsBasketballOutlinedIcon from '@mui/icons-material/SportsBasketballOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import { type CardData } from '../typings';

export const uniqueCardsArray: CardData[] = [
  {
    type: 'bell',
    image: NotificationsOutlinedIcon,
    secondImage: MoodOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'sadFace',
    image: NotificationsActiveOutlinedIcon,
    secondImage: MoodBadOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'calendar',
    image: EventAvailableOutlinedIcon,
    secondImage: PersonPinOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'personLocation',
    image: EventBusyOutlinedIcon,
    secondImage: PersonPinCircleOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'flower',
    image: FilterVintageOutlinedIcon,
    secondImage: PhotoLibraryOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'flare',
    image: FlareOutlinedIcon,
    secondImage: PhotoSizeSelectActualOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'alarm',
    image: AccessAlarmOutlinedIcon,
    secondImage: DonutLargeOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'donut',
    image: AlarmOnOutlinedIcon,
    secondImage: DonutSmallOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'bee',
    image: EmojiNatureOutlinedIcon,
    secondImage: EggOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'egg',
    image: BugReportOutlinedIcon,
    secondImage: EggAltOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'person',
    image: PersonRemoveOutlinedIcon,
    secondImage: SportsBaseballOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'ball',
    image: PersonAddAltOutlinedIcon,
    secondImage: SportsBasketballOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'brush',
    image: BrushOutlinedIcon,
    secondImage: CameraOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'camera',
    image: ColorizeOutlinedIcon,
    secondImage: CameraAltOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'house',
    image: HouseOutlinedIcon,
    secondImage: EscalatorWarningOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'family',
    image: HouseSidingOutlinedIcon,
    secondImage: FamilyRestroomOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'stars',
    image: StarsOutlinedIcon,
    secondImage: SupervisedUserCircleOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'couple',
    image: StarRateOutlinedIcon,
    secondImage: SupervisorAccountOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
  {
    type: 'cutlery',
    image: LocalDiningOutlinedIcon,
    secondImage: FastfoodOutlinedIcon,
    color: 'default',
    complexity: 'normal',
  },
  {
    type: 'food',
    image: RestaurantOutlinedIcon,
    secondImage: LunchDiningOutlinedIcon,
    color: 'default',
    complexity: 'high',
  },
];
