
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  // Replace with your actual email
  if (user?.email !== 'oseik711@gmail.com') {
    return <div className="p-20 text-center">Access Denied.</div>;
  }

  return children;
};

export default AdminRoute;