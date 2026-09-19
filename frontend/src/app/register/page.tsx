'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthView } from '@/components/AuthView';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = (userData: any) => {
    router.push('/');
  };

  return (
    <AuthView 
      initialMode="register"
      onLoginSuccess={handleRegisterSuccess}
    />
  );
}
