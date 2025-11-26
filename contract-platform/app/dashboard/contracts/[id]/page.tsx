'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ContractEditor } from '@/components/editor/ContractEditor';
import { supabase } from '@/lib/supabase';

interface Contract {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'in_review' | 'reviewed' | 'signed' | 'archived';
  counterparty: string | null;
  tags: string[];
  owner_id: string;
  lawyer_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadContract = async () => {
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

      const { data: contractData, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (error || !contractData) {
        router.push('/dashboard/contracts');
        return;
      }

      setContract(contractData);
      setTitle(contractData.title);
      setCounterparty(contractData.counterparty || '');
      setContent(contractData.content);
      setLoading(false);
    };

    loadContract();
  }, [contractId, router]);

  const handleSave = async () => {
    if (!contract) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('contracts')
        .update({
          title,
          content,
          counterparty: counterparty || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contract.id);

      if (error) throw error;

      const { data: versions } = await supabase
        .from('contract_versions')
        .select('version_number')
        .eq('contract_id', contract.id)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      await supabase.from('contract_versions').insert({
        contract_id: contract.id,
        content,
        version_number: nextVersion,
        changed_by: user.id,
        change_description: 'Contract updated',
      });

      setIsEditing(false);
      setContract({ ...contract, title, content, counterparty: counterparty || null });
    } catch (err: any) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

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

  if (!contract) return null;

  return (
    <DashboardLayout role={user?.role || 'startup'}>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon="chevron.left"
            onClick={() => router.push('/dashboard/contracts')}
          >
            Back to Contracts
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-semibold"
                    />
                  ) : (
                    <h1 className="text-3xl font-semibold text-apple-gray-900">{contract.title}</h1>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(contract.status)}
                  {!isEditing ? (
                    <Button
                      variant="primary"
                      icon="square.and.pencil"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setTitle(contract.title);
                          setCounterparty(contract.counterparty || '');
                          setContent(contract.content);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={saving}
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Input
                  label="Counterparty"
                  value={counterparty}
                  onChange={(e) => setCounterparty(e.target.value)}
                />
              ) : (
                contract.counterparty && (
                  <div>
                    <p className="text-sm text-apple-gray-600 mb-1">Counterparty</p>
                    <p className="text-apple-gray-900">{contract.counterparty}</p>
                  </div>
                )
              )}
              <div className="flex gap-4 text-sm text-apple-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(contract.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{' '}
                  {new Date(contract.updated_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ContractEditor
                initialContent={content}
                onChange={setContent}
                readOnly={!isEditing}
              />
            </CardContent>
          </Card>

          {contract.status === 'draft' && !isEditing && (
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-apple-gray-900 mb-1">
                      Ready for legal review?
                    </h3>
                    <p className="text-sm text-apple-gray-600">
                      Send this contract to a lawyer for professional review
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    icon="paperplane"
                  >
                    Send for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
