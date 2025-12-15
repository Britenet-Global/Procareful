import dayjs from 'dayjs';
import type { MenuProps, SelectProps } from 'antd';
import type { BannerNote } from '@ProcarefulAdmin/typings';
import {
  StatusStatusName,
  AdminRolesDtoRoleName,
  type AdminRolesDto,
} from '@Procareful/common/api';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export const dropdownItems: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: <PersonOutlineOutlinedIcon />,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: <PersonOutlineOutlinedIcon />,
    danger: true,
    disabled: true,
  },
];

export const selectItems: SelectProps['options'] = [
  { label: '1st menu item', value: '1st menu item' },
  { label: '2nd menu item', value: '2nd menu item' },
  { label: '3rd menu item', value: '3rd menu item' },
  { label: '1st menu item', value: '1st menu item' },
];

export const notificationsCenterRowData = [
  {
    key: '1',
    added: '1 day ago',
    priority: 'Medium',
    title: 'Monitoring visit requested',
    user: {
      id: '1',
      imageUrl:
        'https://images.pexels.com/photos/64385/pexels-photo-64385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Robert Godwin',
      phoneNumber: '00-123-456-789',
    },
    action: 'Schedule interview',
  },
  {
    key: '2',
    added: '1 day ago',
    priority: 'High',
    title: 'Performance warning!',
    user: {
      id: '2',
      imageUrl:
        'https://images.pexels.com/photos/25758/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Joan Didion',
      phoneNumber: '00-123-456-789',
    },
    action: 'See user details',
  },
  {
    key: '3',
    added: '2 day ago',
    priority: 'Low',
    title: 'Monitoring visit requested',
    user: {
      id: '3',
      imageUrl:
        'https://media.gettyimages.com/id/877385468/photo/robert-kubica-grand-prix-of-canada.jpg?s=2048x2048&w=gi&k=20&c=Opg5rK4fCsloHXm_iInGQHwIM3IcBH8KD1I305F-NLo=',
      userName: 'Robert Kubica',
      phoneNumber: '00-123-456-789',
    },
    action: 'Schedule interview',
  },
  {
    key: '4',
    added: '3 day ago',
    priority: 'Medium',
    title: 'Monitoring visit requested',
    user: {
      id: '4',
      imageUrl:
        'https://images.pexels.com/photos/818261/pexels-photo-818261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Edward Cullen',
      phoneNumber: '00-123-456-789',
    },
    action: 'Schedule interview',
  },
  {
    key: '5',
    added: '3 day ago',
    priority: 'Medium',
    title: 'Monitoring visit requested',
    user: {
      id: '5',
      imageUrl:
        'https://images.pexels.com/photos/3779770/pexels-photo-3779770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Kimberly Elam',
      phoneNumber: '00-123-456-789',
    },
    action: 'Schedule interview',
  },
];

export const usersRowData = [
  {
    key: '1',
    user: {
      id: '111',
      imageUrl:
        'https://images.pexels.com/photos/64385/pexels-photo-64385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Robert Godwin',
      phoneNumber: '00-123-456-789',
    },
    informalCaregiver: {
      id: '11',
      userName: 'Lindsay McCain',
      phoneNumber: '00-123-456-789',
    },
    startDate: '02/12/2022',
    performance: 'on target',
  },
  {
    key: '2',
    user: {
      id: '222',
      userName: 'Joan Didion',
      imageUrl:
        'https://images.pexels.com/photos/25758/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      phoneNumber: '00-123-456-789',
    },
    informalCaregiver: {
      id: '12',
      userName: 'John Elam',
      phoneNumber: '00-123-456-789',
    },
    startDate: '28/09/2021',
    performance: 'performance warning',
  },
  {
    key: '3',
    user: {
      id: '333',
      imageUrl:
        'https://media.gettyimages.com/id/877385468/photo/robert-kubica-grand-prix-of-canada.jpg?s=2048x2048&w=gi&k=20&c=Opg5rK4fCsloHXm_iInGQHwIM3IcBH8KD1I305F-NLo=',
      userName: 'Robert Kubica',
      phoneNumber: '00-123-456-789',
    },
    informalCaregiver: {
      id: '13',
      userName: 'Nancy Fabricant',
      phoneNumber: '00-123-456-789',
    },
    startDate: '28/09/2021',
    performance: 'performance warning',
  },
  {
    key: '4',
    user: {
      id: '444',
      imageUrl:
        'https://images.pexels.com/photos/818261/pexels-photo-818261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Edward Cullen',
      phoneNumber: '00-123-456-789',
    },
    informalCaregiver: {
      id: '14',
      userName: 'Edward Godwin',
      phoneNumber: '00-123-456-789',
    },
    startDate: '28/09/2021',
    performance: 'on target',
  },
  {
    key: '5',
    user: {
      id: '555',
      imageUrl:
        'https://images.pexels.com/photos/818261/pexels-photo-818261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Edward Cullen',
      phoneNumber: '00-123-456-789',
    },
    informalCaregiver: {
      id: '15',
      userName: 'Edward Godwin',
      phoneNumber: '00-123-456-789',
    },
    startDate: '28/09/2021',
    performance: 'performance warning',
  },
  {
    key: '6',
    user: {
      id: '666',
      imageUrl:
        'https://images.pexels.com/photos/3779770/pexels-photo-3779770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      userName: 'Kimberly Elam',
      phoneNumber: '00-123-456-789',
    },
    informalCaregiver: {
      id: '16',
      userName: 'Nancy Wu',
      phoneNumber: '00-123-456-789',
    },
    startDate: '28/09/2021',
    performance: 'on target',
  },
];

export const notificationsCenterData = [
  {
    day: 'Monday',
    value: 3,
    category: 'last week',
  },
  {
    day: 'Tuesday',
    value: 5,
    category: 'last week',
  },
  {
    day: 'Wednesday',
    value: 5,
    category: 'last week',
  },
  {
    day: 'Thursday',
    value: 6,
    category: 'last week',
  },
  {
    day: 'Friday',
    value: 6,
    category: 'last week',
  },
  {
    day: 'Saturday',
    value: 5,
    category: 'last week',
  },
  {
    day: 'Sunday',
    value: undefined,
    category: 'last week',
  },
  {
    day: 'Monday',
    value: 4,
    category: 'this week',
  },
  {
    day: 'Tuesday',
    value: 8,
    category: 'this week',
  },
  {
    day: 'Wednesday',
    value: 8,
    category: 'this week',
  },
  {
    day: 'Thursday',
    value: 10,
    category: 'this week',
  },
  {
    day: 'Friday',
    value: 10,
    category: 'this week',
  },
  {
    day: 'Saturday',
    value: 7,
    category: 'this week',
  },
  {
    day: 'Sunday',
    value: undefined,
    category: 'this week',
  },
];

export const cognitivePlotData = [
  {
    name: 'Last week',
    day: 'Monday',
    value: 35.6,
  },
  {
    name: 'Last week',
    day: 'Tuesday',
    value: 12.4,
  },
  {
    name: 'Last week',
    day: 'Wednesday',
    value: 23.2,
  },
  {
    name: 'Last week',
    day: 'Thursday',
    value: 34.5,
  },
  {
    name: 'Last week',
    day: 'Friday',
    value: 99.7,
  },
  {
    name: 'Last week',
    day: 'Saturday',
    value: 52.6,
  },
  {
    name: 'Last week',
    day: 'Sunday',
    value: undefined,
  },
  {
    name: 'This week',
    day: 'Monday',
    value: 18.9,
  },
  {
    name: 'This week',
    day: 'Tuesday',
    value: 28.8,
  },
  {
    name: 'This week',
    day: 'Wednesday',
    value: 39.3,
  },
  {
    name: 'This week',
    day: 'Thursday',
    value: 81.4,
  },
  {
    name: 'This week',
    day: 'Friday',
    value: 47,
  },
  {
    name: 'This week',
    day: 'Saturday',
    value: 20.3,
  },
  {
    name: 'This week',
    day: 'Sunday',
    value: undefined,
  },
];

export const physicalPlotData = [
  {
    name: 'Last week',
    day: 'Monday',
    value: 35.6,
  },
  {
    name: 'Last week',
    day: 'Tuesday',
    value: 12.4,
  },
  {
    name: 'Last week',
    day: 'Wednesday',
    value: 23.2,
  },
  {
    name: 'Last week',
    day: 'Thursday',
    value: 34.5,
  },
  {
    name: 'Last week',
    day: 'Friday',
    value: 99.7,
  },
  {
    name: 'Last week',
    day: 'Saturday',
    value: 52.6,
  },
  {
    name: 'Last week',
    day: 'Sunday',
    value: undefined,
  },
  {
    name: 'This week',
    day: 'Monday',
    value: 18.9,
  },
  {
    name: 'This week',
    day: 'Tuesday',
    value: 28.8,
  },
  {
    name: 'This week',
    day: 'Wednesday',
    value: 39.3,
  },
  {
    name: 'This week',
    day: 'Thursday',
    value: 81.4,
  },
  {
    name: 'This week',
    day: 'Friday',
    value: 47,
  },
  {
    name: 'This week',
    day: 'Saturday',
    value: 20.3,
  },
  {
    name: 'This week',
    day: 'Sunday',
    value: undefined,
  },
];

export const cognitivePlotDescription = {
  title: 'Cognitive activities',
  subtitle: '2-8 Oct',
};

export const physicalPlotDescription = {
  title: 'Physical activity',
  subtitle: '2-8 Oct',
};

export const scheduleRowDataThisWeek = [
  {
    key: '1',
    monday: {
      activities: [
        {
          title: 'Memory game',
          exerciseType: 'Sequence repetition',
          type: 'cognitive',
          duration: undefined,
          id: '1',
        },
        {
          title: 'Physical activity',
          exerciseType: 'Stretching',
          type: 'physical',
          duration: '15 minutes',
          id: '2',
        },
        {
          title: 'Social activity',
          exerciseType: 'Call your friend',
          type: 'social',
          duration: undefined,
          id: '3',
        },
      ],
    },
    tuesday: {
      activities: [
        {
          title: 'Memory game',
          exerciseType: 'Sequence repetition',
          type: 'cognitive',
          duration: undefined,
          id: '4',
        },
      ],
    },
    wednesday: {
      activities: [
        {
          title: 'Physical activity',
          exerciseType: 'Walk',
          type: 'physical',
          duration: '15 minutes',
          id: '5',
        },
        {
          title: 'Social activity',
          exerciseType: 'Call your friend',
          type: 'social',
          duration: undefined,
          id: '6',
        },
      ],
    },
    thursday: {
      activities: [
        {
          title: 'Cognitive test',
          exerciseType: 'Image recognition',
          type: 'cognitive',
          duration: undefined,
          id: '7',
        },
        {
          title: 'Memory game',
          exerciseType: 'Sequence repetition',
          type: 'cognitive',
          duration: undefined,
          id: '8',
        },
      ],
    },
    friday: {
      activities: [
        {
          title: 'Physical activity',
          exerciseType: 'Walk',
          type: 'physical',
          duration: '30 minutes',
          id: '9',
        },
        {
          title: 'Social',
          exerciseType: 'Attend local event',
          type: 'social',
          duration: undefined,
          id: '10',
        },
      ],
    },
    saturday: { activities: [] },
    sunday: { activities: [] },
  },
];

export const scheduleRowDataLastWeek = [
  {
    key: '1',
    monday: {
      activities: [
        {
          title: 'Cognitive test',
          exerciseType: 'Image recognition',
          type: 'cognitive',
          duration: undefined,
          id: '7',
        },
        {
          title: 'Memory game',
          exerciseType: 'Sequence repetition',
          type: 'cognitive',
          duration: undefined,
          id: '8',
        },
      ],
    },
    tuesday: {
      activities: [
        {
          title: 'Memory game',
          exerciseType: 'Sequence repetition',
          type: 'cognitive',
          duration: undefined,
          id: '1',
        },
        {
          title: 'Physical activity',
          exerciseType: 'Stretching',
          type: 'physical',
          duration: '15 minutes',
          id: '2',
        },
        {
          title: 'Social activity',
          exerciseType: 'Call your friend',
          type: 'social',
          duration: undefined,
          id: '3',
        },
      ],
    },
    wednesday: {
      activities: [
        {
          title: 'Physical activity',
          exerciseType: 'Walk',
          type: 'physical',
          duration: '15 minutes',
          id: '5',
        },
        {
          title: 'Social activity',
          exerciseType: 'Call your friend',
          type: 'social',
          duration: undefined,
          id: '6',
        },
      ],
    },
    thursday: {
      activities: [
        {
          title: 'Physical activity',
          exerciseType: 'Walk',
          type: 'physical',
          duration: '30 minutes',
          id: '9',
        },
        {
          title: 'Social',
          exerciseType: 'Attend local event',
          type: 'social',
          duration: undefined,
          id: '10',
        },
      ],
    },
    friday: {
      activities: [
        {
          title: 'Memory game',
          exerciseType: 'Sequence repetition',
          type: 'cognitive',
          duration: undefined,
          id: '4',
        },
      ],
    },
    saturday: { activities: [] },
    sunday: { activities: [] },
  },
];

export const emergencyContacts = [
  {
    id: '1',
    name: 'Jena Godwin',
    phoneNumber: '00-123-456-789',
    email: 'jenna.godwin@email.com',
  },
  {
    id: '2',
    name: 'Johan Godwin',
    phoneNumber: '00-333-123-7543',
    email: 'johan.godwin@email.com',
  },
];

export const informalCaregiverData = {
  name: 'Johan Meyer',
  phoneNumber: '11-123-678-987',
  email: 'Johan.Meyer@email.com',
};

export const seniorProperties = {
  name: 'Joselyn Godwin-Mayer',
  dateOfBirth: '17-Nov-1948',
  street: 'Maple Street',
  houseNumber: '17',
  zipCode: '12-345',
  town: 'Cityname, CA',
  phoneNumber: '00-123-456-789',
  email: 'Joselyn.Godwin@email.com',
};

export const dummyBannerNote: BannerNote = {
  type: 'warning',
  informalCaregiver: true,
  title: 'Performance warning',
  description: `There's been a recent decline in cognitive performance. Consider exploring additional support or adjusting activities to address this change.
  See details in performance tab.`,
  iconType: 'exclamation',
};

export const notificationsPreferencesRowData = [
  {
    key: '1',
    title: 'Performance decline',
    appNotification: {
      value: true,
      isDisabled: true,
    },
    emailNotification: {
      value: true,
      isDisabled: true,
    },
  },
  {
    key: '2',
    title: 'User inactive for 7+ days',
    appNotification: {
      value: true,
      isDisabled: true,
    },
    emailNotification: {
      value: true,
      isDisabled: true,
    },
  },
  {
    key: '3',
    title: 'Monitoring visit request',
    appNotification: {
      value: true,
      isDisabled: true,
    },
    emailNotification: {
      value: true,
      isDisabled: true,
    },
  },
  {
    key: '4',
    title: 'User completed their daily assignment',
    appNotification: {
      value: true,
      isDisabled: false,
    },
    emailNotification: {
      value: false,
      isDisabled: false,
    },
  },
  {
    key: '5',
    title: 'New message',
    appNotification: {
      value: true,
      isDisabled: false,
    },
    emailNotification: {
      value: true,
      isDisabled: false,
    },
  },
  {
    key: '6',
    title: 'New note added',
    appNotification: {
      value: true,
      isDisabled: false,
    },
    emailNotification: {
      value: false,
      isDisabled: false,
    },
  },
  {
    key: '7',
    title: 'New document uploaded',
    appNotification: {
      value: true,
      isDisabled: false,
    },
    emailNotification: {
      value: false,
      isDisabled: false,
    },
  },
  {
    key: '8',
    title: 'Schedule change - added/deleted game',
    appNotification: {
      value: false,
      isDisabled: false,
    },
    emailNotification: {
      value: false,
      isDisabled: false,
    },
  },
  {
    key: '9',
    title: 'Schedule change - added/deleted task',
    appNotification: {
      value: false,
      isDisabled: false,
    },
    emailNotification: {
      value: false,
      isDisabled: false,
    },
  },
];

export const formalCaregiverDetails = {
  id: '0',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  roles: [{ role_name: AdminRolesDtoRoleName.formalCaregiver }] as AdminRolesDto[],
  dateOfBirth: dayjs('1960-01-01'),
  phoneNumber: '123-456-789',
  emailAddress: 'john.doe@example.com',
  street: '123 Main Street',
  building: 'Building A',
  flat: 'A-101',
  zipCode: '12345',
  status: StatusStatusName.active,
  position: ['Nurse', 'Formal Caregiver'],
  assignedSeniors: [
    {
      id: '1',
      fullName: 'Johan Meyer',
      phoneNumber: '123-678-987',
      firstName: 'Thomas',
      lastName: 'Train',
      dateOfBirth: dayjs('1960-01-01'),
      emailAddress: 'Johan.Meyer@email.com',
      street: '123 Main Street',
      building: 'Building A',
      flat: 'A-101',
      zipCode: '12345',
      status: StatusStatusName.active,
      assignedCaregiver: {
        id: '23231',
        firstName: 'Adam',
        lastName: 'Smith',
        fullName: 'Adam Smith',
        role: 'Nurse',
        dateOfAssignment: dayjs('2022-02-28'),
        status: StatusStatusName.inactive,
      },
    },
    {
      id: '223323',
      fullName: 'Robert Kubica',
      phoneNumber: '123-678-987',
      firstName: 'Robert',
      lastName: 'Kubica',
      dateOfBirth: dayjs('1960-01-01'),
      emailAddress: 'Robert.Kubica@email.com',
      street: '123 Main Street',
      building: 'Building A',
      flat: 'A-101',
      zipCode: '12345',
      status: StatusStatusName.active,
      assignedCaregiver: {
        id: '12323',
        firstName: 'Martha',
        lastName: 'Dimitry',
        fullName: 'Martha Dimitry',
        role: 'Nurse',
        dateOfAssignment: dayjs('2022-12-28'),
        status: StatusStatusName.active,
      },
    },
    {
      id: '32323',
      fullName: 'Ana de Amas',
      phoneNumber: '123-678-987',
      firstName: 'Ana',
      lastName: 'de Amas',
      dateOfBirth: dayjs('1960-01-01'),
      emailAddress: 'ana.amas@email.com',
      street: '123 Main Street',
      building: 'Building A',
      flat: 'A-101',
      zipCode: '12345',
      status: StatusStatusName.active,
      assignedCaregiver: {
        id: '12323',
        firstName: 'Stephen',
        lastName: 'King',
        fullName: 'Stephen King',
        role: 'Nurse',
        dateOfAssignment: dayjs('2022-12-28'),
        status: StatusStatusName.active,
      },
    },
  ],
};
