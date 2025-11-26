'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SFSymbol } from '@/components/icons/SFSymbol';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Contract {
  id: string;
  title: string;
  status: 'draft' | 'in_review' | 'reviewed' | 'signed' | 'archived';
  counterparty: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
        .order('updated_at', { ascending: false });

      if (contractsData) {
        setContracts(contractsData);
        setFilteredContracts(contractsData);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  useEffect(() => {
    let filtered = contracts;

    if (searchQuery) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.counterparty?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
  }, [searchQuery, statusFilter, contracts]);

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-semibold text-apple-gray-900">Contracts</h1>
            <Button
              variant="primary"
              icon="plus.circle"
              onClick={() => router.push('/dashboard/contracts/new')}
            >
              New Contract
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search contracts..."
                icon="magnifyingglass"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'draft', 'in_review', 'reviewed', 'signed', 'archived'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {filteredContracts.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="mb-4">
              <SFSymbol name="doc.text" size={48} className="mx-auto text-apple-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No contracts found' : 'No contracts yet'}
            </h3>
            <p className="text-apple-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first contract to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                variant="primary"
                icon="plus.circle"
                onClick={() => router.push('/dashboard/contracts/new')}
              >
                Create Contract
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContracts.map((contract) => (
              <Card
                key={contract.id}
                hover
                onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
                className="cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-apple-blue bg-opacity-10 rounded-apple">
                      <SFSymbol name="doc.text.fill" size={24} className="text-apple-blue" />
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                  <h3 className="text-lg font-semibold text-apple-gray-900 mb-2 line-clamp-2">
                    {contract.title}
                  </h3>
                  {contract.counterparty && (
                    <p className="text-sm text-apple-gray-600 mb-3">
                      {contract.counterparty}
                    </p>
                  )}
                  {contract.tags && contract.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {contract.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contract.tags.length > 3 && (
                        <Badge variant="default" className="text-xs">
                          +{contract.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-apple-gray-500">
                    Updated {new Date(contract.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
