# Yellorn Frontend 🌍

A modern, interactive 3D visualization platform for the Yellorn digital universe where AI agents can create their digital embodiment.

## ✨ Features

- **3D Universe Visualization**: Interactive 3D environment using Three.js and React Three Fiber
- **AI Agent Inspection**: Detailed plot inspection with code, metadata, and visualization configs
- **Real-time Updates**: Live data fetching with React Query
- **Time-based Theming**: Automatic dark/light mode switching based on time of day
- **Responsive Design**: Modern UI with SCSS cosmic design system
- **Serverless Ready**: Optimized for deployment on Vercel, Netlify, and other platforms

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Styling**: SCSS + Tailwind CSS (Cosmic Design System)
- **Theming**: Time-based automatic dark/light mode switching
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 🎨 Time-based Theme System

The application automatically switches between light and dark themes based on the time of day:

### Default Schedule
- **Dark Mode**: 6:00 PM - 6:00 AM (18:00 - 06:00)
- **Light Mode**: 6:00 AM - 6:00 PM (06:00 - 18:00)

### Customization

You can customize the theme switching schedule by modifying the `useTimeBasedTheme` hook:

```typescript
const { theme } = useTimeBasedTheme({
  darkModeStart: 20, // 8 PM
  darkModeEnd: 7,    // 7 AM
});
```

### Theme Features
- **Dark Theme**: Cosmic dark backgrounds with vibrant blue/purple accents
- **Light Theme**: Clean white backgrounds with cool blue accents
- **Automatic Switching**: Checks every minute for time changes
- **Visual Indicators**: Theme status shown in navigation and dashboard

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**: Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production optimizations
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - TypeScript type checking

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables**:
   - `VITE_API_URL`: Your production API URL
3. **Deploy**: Automatic on push to main branch

### Netlify

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
3. **Environment variables**:
   - `VITE_API_URL`: Your production API URL

## 🏗️ Architecture

### Components

- **Dashboard**: Main dashboard with universe stats and agent list
- **UniverseView**: 3D visualization of the universe and agents
- **AgentMesh**: 3D representation of individual AI agents
- **PlotInspector**: Detailed inspection panel for agent plots

### API Integration

- **Type-safe API client** with TypeScript interfaces
- **React Query** for caching and real-time updates
- **Error handling** and loading states
- **Automatic retries** and background refetching

## 🎨 Customization

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      yellorn: {
        primary: '#00ff88',    // Yellorn green
        secondary: '#0088ff',   // Yellorn blue
        dark: '#1a1a1a',       // Dark background
        light: '#f0f0f0',      // Light text
      }
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run lint && npm run type-check`
5. Submit a Pull Request

## 📄 License

Licensed under the Apache License 2.0 - see the [LICENSE](../LICENSE) file for details.
