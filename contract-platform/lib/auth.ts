import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'startup' | 'lawyer' | 'enterprise_admin';
  organizationName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => {
  const { email, password, fullName, role, organizationName } = data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  let organizationId = null;

  if (role === 'startup' || role === 'enterprise_admin') {
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName || `${fullName}'s Organization`,
        plan: role === 'enterprise_admin' ? 'enterprise' : 'starter',
      })
      .select()
      .single();

    if (orgError) throw orgError;
    organizationId = orgData.id;
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role,
    organization_id: organizationId,
  });

  if (profileError) throw profileError;

  return { user: authData.user, session: authData.session };
};

export const signIn = async (data: SignInData) => {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return { user: authData.user, session: authData.session };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();

  return profile;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
};
