'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ContractEditor } from '@/components/editor/ContractEditor';
import { supabase } from '@/lib/supabase';

export default function NewContractPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (status: 'draft' | 'in_review' = 'draft') => {
    if (!title.trim()) {
      setError('Please enter a contract title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('contracts')
        .insert({
          title,
          content,
          counterparty: counterparty || null,
          status,
          owner_id: user.id,
          tags: [],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await supabase.from('contract_versions').insert({
        contract_id: data.id,
        content,
        version_number: 1,
        changed_by: user.id,
        change_description: 'Initial version',
      });

      router.push(`/dashboard/contracts/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save contract');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="startup">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon="chevron.left"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-apple-red rounded-apple text-sm text-apple-red">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-apple-gray-900">Contract Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Contract Title"
                placeholder="e.g., Service Agreement with ABC Corp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                label="Counterparty (Optional)"
                placeholder="e.g., ABC Corporation"
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-apple-gray-900">Contract Content</h2>
            </CardHeader>
            <CardContent>
              <ContractEditor
                initialContent={content}
                onChange={setContent}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => handleSave('draft')}
              loading={saving}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              icon="paperplane"
              onClick={() => handleSave('draft')}
              loading={saving}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
