'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signUp } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'startup' as 'startup' | 'lawyer' | 'enterprise_admin',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-apple-gray-50 to-apple-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-apple-gray-900 mb-2">
            Get started
          </h1>
          <p className="text-apple-gray-600">
            Create your ContractOS account
          </p>
        </div>

        <div className="bg-white rounded-apple-xl shadow-apple-lg border border-apple-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-apple-red rounded-apple text-sm text-apple-red">
                {error}
              </div>
            )}

            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              icon="person"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="you@company.com"
              icon="envelope"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              icon="the-lock"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                I am a
              </label>
              <div className="space-y-2">
                {[
                  { value: 'startup', label: 'Startup Founder' },
                  { value: 'lawyer', label: 'Legal Professional' },
                  { value: 'enterprise_admin', label: 'Enterprise Admin' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-3 border border-apple-gray-200 rounded-apple hover:bg-apple-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-4 h-4 text-apple-blue focus:ring-apple-blue"
                    />
                    <span className="text-apple-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(formData.role === 'startup' || formData.role === 'enterprise_admin') && (
              <Input
                type="text"
                label="Organization Name"
                placeholder="Acme Inc."
                icon="folder"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-apple-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-apple-blue hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
