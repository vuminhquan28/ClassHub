'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthView } from '@/components/AuthView';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (userData: any) => {
    router.push('/dashboard');
  };

  return (
    <AuthView 
      initialMode="login"
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
