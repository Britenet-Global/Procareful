# Procareful 🧠

This is the frontend monorepo for Procareful, managing multiple applications including `procareful` (mobile app for seniors) and `procareful-admin` (Admin Dashboard).

## Technologies Used 🖥️

Our application utilizes the following technologies:

- **NX** for monorepo management
- **TypeScript**
- **Vite**
- **React**
- **Ant Design** & [Ant Design Styles](https://ant-design.github.io/antd-style)
- **Zustand**
- **TanStack Query**
- **Orval** for API code generation
- **i18next** for translations

## Getting Started 🚀

### Prerequisites

1. **Environment Variables**:
   Copy `.env.example` to `.env` and populate the necessary keys.
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Running the Applications

To start the development server, run:

```bash
npm start [applicationName]
```

Where `[applicationName]` is one of:
- `procareful`
- `procareful-admin`

The application will be available at http://localhost:4200/.

## Development Workflow 🛠️

### API Code Generation

We use **Orval** to generate React Query hooks and API types.

- **During Development**: `npm run start [appName]` automatically generates API code.
- **Manual Update**: Run `npm run generate-api` to refresh API clients.

### Code Formatting & Linting 🧑‍💻

- **Lint**: `npx nx lint [appName]` (uses ESLint)
- **Format**: `npm run prettier:fix` (uses Prettier)

### Styling 🐜

We use [Ant Design Styles](https://ant-design.github.io/antd-style) (similar to Styled Components) for component styling.

## Internationalization (i18n) 🌍

We use `i18next`. Translation keys are organized by specific prefixes:
`Prefixes = 'admin' | 'shared' | 'senior'`
`SubPrefixes = 'btn' | 'title' | 'form' | 'inf' | 'alert' | 'table'`

### Pluralization
Use `{{count}}` variable for pluralization.
Example:
```ts
"key": "{{count}} attachment",
"key_plural": "{{count}} attachments"
```
Usage:
```ts
i18next.t('key', { count: 5 });
```

## Useful NX Commands

- Run tasks: `nx <target> <project>`
- Run many: `nx run-many -t <target>`
- Build: `nx build [project]`
