# Procareful Project Documentation

## Project Overview

Procareful is a monorepo project built with NX, consisting of two main applications and several shared libraries. The project focuses on providing cognitive health solutions, with separate applications for end-users (seniors) and administrators.

### Main Applications

1. **Procareful PWA** (`apps/procareful`)

   - A Progressive Web Application designed for senior users
   - Focuses on cognitive health activities, games, and personal growth
   - Features include physical activities tracking, diary management, and cognitive games

2. **Procareful Admin Panel** (`apps/procareful-admin`)
   - Administrative dashboard for managing the Procareful platform
   - Provides tools for content management, user administration, and analytics

### Shared Libraries

1. **Common Library** (`libs/common`)

   - Contains shared functionality used by both applications
   - Includes API integrations, internationalization (i18n), constants, hooks, and utility functions
   - Manages API code generation through Orval

2. **Games Library** (`libs/games`)

   - Collection of cognitive games implemented as React components
   - Includes games such as:
     - Memory
     - Snake
     - 2048
     - Sudoku
     - Tic-Tac-Toe
     - Word Guess
     - Wordle

3. **UI Library** (`libs/ui`)
   - Shared UI components and design system
   - Includes reusable components like:
     - Typography
     - Form elements
     - Layout components
     - Authentication components
     - Custom inputs

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Monorepo Management**: NX
- **UI Framework**: Ant Design (ANTD)
- **State Management**: Zustand
- **API Management**: TanStack Query (React Query)
- **Form Management**: React Hook Form
- **Styling**: antd-style (similar to Styled Components)
- **Internationalization**: i18next
- **API Code Generation**: Orval
- **Testing**: Vitest

## Project Structure

```
procareful/
├── apps/
│   ├── procareful/             # Senior user PWA
│   │   ├── public/             # Static assets
│   │   └── src/
│   │       ├── app/
│   │       │   ├── components/ # Reusable components
│   │       │   ├── constants/  # Application constants
│   │       │   ├── hooks/      # Custom React hooks
│   │       │   ├── layout/     # Layout components
│   │       │   ├── screens/    # Application screens/pages
│   │       │   ├── styles/     # Global styles
│   │       │   ├── types/      # TypeScript type definitions
│   │       │   └── utils/      # Utility functions
│   │       └── assets/         # Application-specific assets
│   │
│   └── procareful-admin/       # Admin dashboard
│       ├── public/             # Static assets
│       └── src/
│           ├── app/
│           │   ├── components/ # Admin-specific components
│           │   ├── constants/  # Admin constants
│           │   ├── hooks/      # Admin-specific hooks
│           │   ├── pages/      # Admin pages
│           │   ├── store/      # State management
│           │   ├── styles/     # Admin styles
│           │   ├── typings/    # TypeScript types
│           │   └── utils/      # Admin utilities
│           └── assets/         # Admin-specific assets
│
├── libs/
│   ├── common/                 # Shared functionality
│   │   └── src/
│   │       ├── api/            # API integration and types
│   │       ├── i18n/           # Internationalization
│   │       └── lib/
│   │           ├── constants/  # Shared constants
│   │           ├── hooks/      # Shared hooks
│   │           ├── typings/    # Shared types
│   │           └── utils/      # Shared utilities
│   │
│   ├── games/                  # Cognitive games library
│   │   └── src/
│   │       ├── Game2048/       # 2048 game implementation
│   │       ├── Memory/         # Memory game implementation
│   │       ├── Snake/          # Snake game implementation
│   │       ├── Sudoku/         # Sudoku game implementation
│   │       ├── tic-tac-toe/    # Tic-Tac-Toe implementation
│   │       ├── wordGuess/      # Word Guess game implementation
│   │       ├── Wordle/         # Wordle game implementation
│   │       ├── components/     # Shared game components
│   │       └── hooks/          # Game-specific hooks
│   │
│   └── ui/                     # UI component library
│       └── src/
│           ├── assets/         # Shared UI assets
│           └── lib/
│               ├── components/ # Reusable UI components
│               ├── constants/  # UI constants
│               └── hooks/      # UI-specific hooks
```

## Development Workflow

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure environment variables
4. Start the application:
   - For senior app: `npm start procareful`
   - For admin panel: `npm start procareful-admin`

### Branch Naming Convention

- Format: `[typeOfTask]/taskId`
- `typeOfTask`: `feature`, `refactor`, or `bugfix`
- `taskId`: Jira task ID (e.g., `PRC-123`)
- Example: `feature/PRC-123`

### Pull Request Guidelines

- Start title with uppercase letter
- Include task ID in square brackets: `[PRC-123]`
- Include brief description
- Example: `[PRC-123] Add super cool animation that only frontend folks will appreciate`

### Code Formatting and Linting

- Code formatting: Prettier (`npm run prettier:fix`)
- Code linting: ESLint (`npm run lint:fix`)
- Pre-commit hooks are set up with Husky

## API Integration

The project uses Orval for API code generation:

- API client code is generated based on OpenAPI specifications
- Generated code includes React Query hooks and TypeScript types
- To update API client: `npm run generate-api`
- API code is automatically generated during development

## Internationalization (i18n)

The project supports multiple languages using i18next:

- Translation keys follow a structured naming convention:
  - Prefixes: `'admin' | 'shared' | 'senior'`
  - SubPrefixes: `'btn' | 'title' | 'form' | 'inf' | 'alert' | 'table'`
  - Pattern: `${Prefixes}_${SubPrefixes}_${string}`
- Plural and singular forms are supported
- Supported languages: English, German, Croatian, Hungarian, Italian, Polish, Slovenian

## Build and Deployment

### Building Applications

- Build senior app: `npm run build:procareful`
- Build admin panel: `npm run build:procareful-admin`
- Build all applications: `npm run build:all-apps`

### Docker Support

The project includes Docker configuration for development and deployment:

- Development: `docker-compose-dev.yml`
- UAT environment: `docker-compose-uat.yml`
- Each application has its own Dockerfile

## Key Features

### Procareful PWA (Senior App)

- Dashboard with activity overview
- Physical activity tracking and details
- Personal growth activities
- Diary management
- Cognitive games
- User authentication (email and phone)
- Settings management

### Procareful Admin Panel

- User management
- Content administration
- Activity management
- Assessment reporting
- Analytics and reporting

## Games Library

The project includes several cognitive games designed to improve mental acuity:

1. **Memory** - Card matching memory game
2. **Snake** - Classic snake game
3. **2048** - Number sliding puzzle game
4. **Sudoku** - Number placement puzzle
5. **Tic-Tac-Toe** - Classic game of X's and O's
6. **Word Guess** - Word guessing game
7. **Wordle** - Word puzzle game with letter placement feedback

Each game includes:

- Tutorial screens
- Difficulty settings
- Performance tracking
- Feedback mechanisms

## Contributing

1. Follow the branch naming convention
2. Adhere to code formatting and linting rules
3. Write meaningful commit messages
4. Create pull requests following the established guidelines
5. Ensure all tests pass before submitting PR

## Additional Resources

- NX Documentation: [https://nx.dev/](https://nx.dev/)
- React Query: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- Ant Design: [https://ant.design/](https://ant.design/)
- Zustand: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- i18next: [https://www.i18next.com/](https://www.i18next.com/)
