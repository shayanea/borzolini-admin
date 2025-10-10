# Borzolini Admin Panel

Admin interface for the Borzolini veterinary clinic management system.

## Stack

- React 18 + TypeScript
- Vite (build tool)
- Ant Design 5 (UI)
- Tailwind CSS
- Zustand (local state)
- React Query (server state)
- React Router DOM
- Axios

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create `.env`:

```env
VITE_API_URL=http://192.168.70.174:3001
```

Start dev server:

```bash
pnpm dev
```

App runs on `http://localhost:3002`

## Project Structure

```
src/
├── components/     # UI components split by feature
├── hooks/          # Custom hooks
├── pages/          # Route pages
├── services/       # API service layer
├── stores/         # Zustand stores
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

## Scripts

- `pnpm dev` - Dev server
- `pnpm build` - Production build
- `pnpm preview` - Preview production build
- `pnpm lint` - Check for errors
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm type-check` - TypeScript validation

## Design Tokens

Colors:

- Primary Navy: `#14213d`
- Primary Orange: `#fca311`
- Neutral Light: `#e5e5e5`

Fonts:

- Body: Inter
- Headings: Poppins

## Key Features

### Authentication

JWT-based auth with automatic token refresh. Protected routes check user roles.

### Calendar System

Full appointment scheduling with drag-and-drop, recurring appointments, and availability checking.

### User Management

CRUD operations for veterinarians, staff, and pet owners. Role-based access control.

### Real-time Updates

React Query handles caching and background refetching. Stale time configured per data type.

## API Integration

All API calls go through the service layer (`src/services/`). Never make direct axios calls.

Service pattern:

```typescript
class MyService {
  static async getAll(params) {
    return apiService.get('/endpoint', { params });
  }
}
```

API docs: `http://192.168.70.174:3001/api/docs`

## Environment Variables

Required:

- `VITE_API_URL` - Backend API URL

Optional:

- `VITE_DEBUG` - Enable debug logging

## Common Issues

**Port already in use**: Change port in `vite.config.ts`

**CORS errors**: Backend needs to allow localhost:3002

**Type errors after pulling**: Run `pnpm install` to update types

**Build fails**: Clear `node_modules` and reinstall

## Deployment

Build:

```bash
pnpm build
```

Deploy the `dist/` folder to your hosting service. Make sure to set the `VITE_API_URL` environment variable for production.
