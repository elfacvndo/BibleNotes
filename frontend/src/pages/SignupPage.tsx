import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignupForm />
    </div>
  );
};

export default SignupPage;
