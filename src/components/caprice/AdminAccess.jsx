import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCaprice } from '@/components/caprice/AppContext';
import isCapriceAdmin from '@/components/caprice/adminAccess';
export default function AdminAccess({ children }) {
  const { user, userLoading } = useCaprice();
  if (userLoading) return <p className="screen" role="status">Vérification de l’accès…</p>;
  return isCapriceAdmin(user) ? children : <Navigate to="/profile" replace />;
}