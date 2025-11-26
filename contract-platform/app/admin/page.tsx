'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SFSymbol } from '@/components/icons/SFSymbol';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Stats {
  totalContracts: number;
  activeUsers: number;
  pendingReviews: number;
  signedContracts: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalContracts: 0,
    activeUsers: 0,
    pendingReviews: 0,
    signedContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single();

      setUser(profile);

      if (profile?.role !== 'enterprise_admin') {
        router.push('/dashboard');
        return;
      }

      if (profile.organization_id) {
        const { data: contracts } = await supabase
          .from('contracts')
          .select('*')
          .eq('organization_id', profile.organization_id);

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('organization_id', profile.organization_id);

        setStats({
          totalContracts: contracts?.length || 0,
          activeUsers: profiles?.length || 0,
          pendingReviews: contracts?.filter(c => c.status === 'in_review').length || 0,
          signedContracts: contracts?.filter(c => c.status === 'signed').length || 0,
        });
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout role="enterprise_admin">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-apple-blue border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="enterprise_admin">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-apple-gray-900 mb-2">
            Enterprise Dashboard
          </h1>
          <p className="text-apple-gray-600">
            {user?.organizations?.name} - Organization Overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Total Contracts</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{stats.totalContracts}</p>
                </div>
                <div className="p-3 bg-apple-blue bg-opacity-10 rounded-apple">
                  <SFSymbol name="doc.text.fill" size={24} className="text-apple-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Active Users</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{stats.activeUsers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-apple">
                  <SFSymbol name="person.2" size={24} className="text-apple-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Pending Reviews</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{stats.pendingReviews}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-apple">
                  <SFSymbol name="clock" size={24} className="text-apple-orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Signed</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{stats.signedContracts}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-apple">
                  <SFSymbol name="checkmark.circle.fill" size={24} className="text-apple-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-apple-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => router.push('/admin/team')}
                className="w-full flex items-center justify-between p-4 bg-apple-gray-50 hover:bg-apple-gray-100 rounded-apple transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SFSymbol name="person.2" size={20} className="text-apple-blue" />
                  <span className="font-medium text-apple-gray-900">Manage Team</span>
                </div>
                <SFSymbol name="chevron.right" size={20} className="text-apple-gray-400" />
              </button>

              <button
                onClick={() => router.push('/admin/contracts')}
                className="w-full flex items-center justify-between p-4 bg-apple-gray-50 hover:bg-apple-gray-100 rounded-apple transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SFSymbol name="doc.text" size={20} className="text-apple-blue" />
                  <span className="font-medium text-apple-gray-900">View All Contracts</span>
                </div>
                <SFSymbol name="chevron.right" size={20} className="text-apple-gray-400" />
              </button>

              <button
                onClick={() => router.push('/admin/audit')}
                className="w-full flex items-center justify-between p-4 bg-apple-gray-50 hover:bg-apple-gray-100 rounded-apple transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SFSymbol name="clock" size={20} className="text-apple-blue" />
                  <span className="font-medium text-apple-gray-900">Audit Logs</span>
                </div>
                <SFSymbol name="chevron.right" size={20} className="text-apple-gray-400" />
              </button>

              <button
                onClick={() => router.push('/admin/settings')}
                className="w-full flex items-center justify-between p-4 bg-apple-gray-50 hover:bg-apple-gray-100 rounded-apple transition-colors"
              >
                <div className="flex items-center gap-3">
                  <SFSymbol name="gear" size={20} className="text-apple-blue" />
                  <span className="font-medium text-apple-gray-900">Settings</span>
                </div>
                <SFSymbol name="chevron.right" size={20} className="text-apple-gray-400" />
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-apple-gray-900">Organization Plan</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-apple-gray-600">Current Plan</span>
                  <Badge variant="info">{user?.organizations?.plan}</Badge>
                </div>
                <div className="pt-4 border-t border-apple-gray-100">
                  <p className="text-sm text-apple-gray-600 mb-3">
                    Your enterprise plan includes:
                  </p>
                  <ul className="space-y-2 text-sm text-apple-gray-700">
                    <li className="flex items-center gap-2">
                      <SFSymbol name="checkmark" size={16} className="text-apple-green" />
                      Unlimited contracts
                    </li>
                    <li className="flex items-center gap-2">
                      <SFSymbol name="checkmark" size={16} className="text-apple-green" />
                      Unlimited team members
                    </li>
                    <li className="flex items-center gap-2">
                      <SFSymbol name="checkmark" size={16} className="text-apple-green" />
                      Advanced audit logging
                    </li>
                    <li className="flex items-center gap-2">
                      <SFSymbol name="checkmark" size={16} className="text-apple-green" />
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
