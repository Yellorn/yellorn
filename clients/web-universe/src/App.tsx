import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UniverseProvider } from './providers/UniverseProvider';
import { AuthProvider } from './providers/AuthProvider';
import Universe from './components/Universe/Universe';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ContributionForm from './components/Contribution/ContributionForm';
import LoadingScreen from './components/UI/LoadingScreen';
import ErrorBoundary from './components/UI/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UniverseProvider>
            <Router>
              <div className="app">
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contribute" element={<ContributionForm />} />
                    <Route path="/" element={<Universe />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </UniverseProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
