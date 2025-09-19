# Borzolini Admin Panel

A professional clinic management admin panel built with React, TypeScript, Ant Design, and modern web technologies.

## 🚀 Features

- **Authentication System**: Complete login/logout with JWT tokens
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for local state, React Query for server state
- **Modern UI**: Ant Design components with custom theming
- **Calendar Management**: Advanced appointment scheduling interface
- **User Management**: Complete CRUD operations for users and staff
- **Real-time Updates**: React Query for efficient data fetching
- **Professional Styling**: Consistent design system with brand colors

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Ant Design 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Date Handling**: Day.js
- **Form Handling**: React Hook Form + Zod validation
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Modern web browser

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd admin
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the admin directory:

```env
VITE_API_URL=http://192.168.70.174:3001
```

### 3. Start Development Server

```bash
pnpm dev
```

The admin panel will be available at `http://localhost:3002`

### 4. Build for Production

```bash
pnpm build
```

## 🏗️ Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎨 Design System

### Color Palette

- **Primary Navy**: `#14213d` - Main brand color
- **Primary Orange**: `#fca311` - Accent color
- **Primary Dark**: `#000000` - Text and borders
- **Neutral Light**: `#e5e5e5` - Backgrounds
- **Health Colors**: Green for success, orange for warnings, red for errors

### Typography

- **Primary Font**: Inter (system fallback)
- **Heading Font**: Poppins (system fallback)
- **Font Weights**: 300, 400, 500, 600, 700

## 🔐 Authentication

The admin panel uses JWT-based authentication with the following features:

- **Login/Logout**: Secure authentication flow
- **Protected Routes**: Role-based access control
- **Token Management**: Automatic token refresh
- **Session Persistence**: Local storage with Zustand
- **Error Handling**: Comprehensive error messages

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch Friendly**: Optimized for touch interactions
- **Flexible Layout**: Adaptive sidebar and content areas

## 🧪 Development

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler
- `pnpm format` - Format code with Prettier

## 🔌 API Integration

The admin panel integrates with the Borzolini backend API:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Fetching**: React Query for efficient caching and updates

## 🎯 Key Components

### Authentication Components

- `LoginForm` - User login interface
- `ProtectedRoute` - Route protection wrapper
- `useAuth` - Authentication hook

### Layout Components

- `AdminLayout` - Main application layout
- `Sidebar` - Navigation sidebar
- `Header` - Top navigation bar

### Page Components

- `Dashboard` - Main dashboard with statistics
- `Calendar` - Appointment scheduling interface
- `Users` - User management
- `Appointments` - Appointment management
- `Reports` - Analytics and reporting
- `Settings` - System configuration

## 🚀 Deployment

### Build Process

1. Install dependencies: `pnpm install`
2. Build the application: `pnpm build`
3. Deploy the `dist/` folder to your hosting service

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_APP_TITLE` - Application title
- `VITE_APP_VERSION` - Application version

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Use TypeScript for all new code
3. Follow React best practices
4. Write meaningful commit messages
5. Test your changes thoroughly

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change the port in `vite.config.ts`
2. **API connection**: Verify `VITE_API_URL` in `.env`
3. **Build errors**: Clear `node_modules` and reinstall dependencies

### Getting Help

- Check the console for error messages
- Verify environment variables are set correctly
- Ensure the backend API is running and accessible

## 📄 License

This project is part of the Borzolini Veterinary Clinic management system.

---

Built with ❤️ for better veterinary care management.
