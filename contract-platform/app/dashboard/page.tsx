'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SFSymbol } from '@/components/icons/SFSymbol';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Contract {
  id: string;
  title: string;
  status: 'draft' | 'in_review' | 'reviewed' | 'signed' | 'archived';
  counterparty: string | null;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
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
        .select('*')
        .eq('id', user.id)
        .single();

      setUser(profile);

      const { data: contractsData } = await supabase
        .from('contracts')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (contractsData) {
        setContracts(contractsData);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      draft: 'default',
      in_review: 'info',
      reviewed: 'warning',
      signed: 'success',
      archived: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout role="startup">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-apple-blue border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={user?.role || 'startup'}>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-apple-gray-900 mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
          </h1>
          <p className="text-apple-gray-600">
            Manage your contracts and collaborate with your legal team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Total Contracts</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{contracts.length}</p>
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
                  <p className="text-sm text-apple-gray-600 mb-1">In Review</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">
                    {contracts.filter(c => c.status === 'in_review').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-apple">
                  <SFSymbol name="clock" size={24} className="text-apple-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Signed</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">
                    {contracts.filter(c => c.status === 'signed').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-apple">
                  <SFSymbol name="checkmark.circle.fill" size={24} className="text-apple-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-apple-gray-900">Recent Contracts</h2>
          <Button
            variant="primary"
            icon="plus.circle"
            onClick={() => router.push('/dashboard/contracts/new')}
          >
            New Contract
          </Button>
        </div>

        <Card>
          {contracts.length === 0 ? (
            <CardContent className="py-12 text-center">
              <div className="mb-4">
                <SFSymbol name="doc.text" size={48} className="mx-auto text-apple-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No contracts yet</h3>
              <p className="text-apple-gray-600 mb-6">
                Create your first contract to get started
              </p>
              <Button
                variant="primary"
                icon="plus.circle"
                onClick={() => router.push('/dashboard/contracts/new')}
              >
                Create Contract
              </Button>
            </CardContent>
          ) : (
            <div className="divide-y divide-apple-gray-100">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="p-6 hover:bg-apple-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-apple-gray-900 mb-1">
                        {contract.title}
                      </h3>
                      {contract.counterparty && (
                        <p className="text-sm text-apple-gray-600">
                          Counterparty: {contract.counterparty}
                        </p>
                      )}
                      <p className="text-xs text-apple-gray-500 mt-1">
                        Updated {new Date(contract.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(contract.status)}
                      <SFSymbol name="chevron.right" size={20} className="text-apple-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
