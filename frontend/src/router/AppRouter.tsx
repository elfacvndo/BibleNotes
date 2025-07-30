import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HomePage from '../pages/HomePage';
import NotesPage from '../pages/NotesPage';
import SearchPage from '../pages/SearchPage';
import BiblePage from '../pages/BiblePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Spinner from '../components/common/Spinner';
import ProtectedLayout from '../components/layout/ProtectedLayout';

const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
        {isAuthenticated ? (
            <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<HomePage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="bible" element={<BiblePage />} />
                {/* Add other protected routes here */}
            </Route>
        ) : (
            <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </>
        )}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
};

export default AppRouter;
