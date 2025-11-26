'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SFSymbol } from '@/components/icons/SFSymbol';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  contract_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  fee_amount: number;
  paid: boolean;
  created_at: string;
  contracts: {
    title: string;
    counterparty: string | null;
  };
}

export default function LawyerDashboardPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
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

      if (profile?.role !== 'lawyer') {
        router.push('/dashboard');
        return;
      }

      const { data: reviewsData } = await supabase
        .from('lawyer_reviews')
        .select(`
          *,
          contracts (
            title,
            counterparty
          )
        `)
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false });

      if (reviewsData) {
        setReviews(reviewsData);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const pendingReviews = reviews.filter(r => r.status === 'pending' || r.status === 'in_progress');
  const completedReviews = reviews.filter(r => r.status === 'completed');
  const totalEarnings = completedReviews.reduce((sum, r) => sum + Number(r.fee_amount), 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout role="lawyer">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-apple-blue border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="lawyer">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-apple-gray-900 mb-2">
            Lawyer Dashboard
          </h1>
          <p className="text-apple-gray-600">
            Manage your contract reviews and track earnings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Pending Reviews</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{pendingReviews.length}</p>
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
                  <p className="text-sm text-apple-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">{completedReviews.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-apple">
                  <SFSymbol name="checkmark.circle.fill" size={24} className="text-apple-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-apple-gray-600 mb-1">Total Earnings</p>
                  <p className="text-3xl font-semibold text-apple-gray-900">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-apple">
                  <SFSymbol name="star.fill" size={24} className="text-apple-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold text-apple-gray-900 mb-6">Review Queue</h2>

        {pendingReviews.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="mb-4">
              <SFSymbol name="checkmark.circle" size={48} className="mx-auto text-apple-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2">All caught up!</h3>
            <p className="text-apple-gray-600">
              No pending reviews at the moment
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <Card
                key={review.id}
                hover
                onClick={() => router.push(`/lawyer/review/${review.id}`)}
                className="cursor-pointer"
              >
                <CardContent className="py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-apple-gray-900 mb-1">
                        {review.contracts.title}
                      </h3>
                      {review.contracts.counterparty && (
                        <p className="text-sm text-apple-gray-600 mb-2">
                          Counterparty: {review.contracts.counterparty}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-apple-gray-500">
                        <span>Fee: ${review.fee_amount}</span>
                        <span>•</span>
                        <span>Submitted {new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(review.status)}
                      <SFSymbol name="chevron.right" size={20} className="text-apple-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {completedReviews.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-6 mt-12">Recently Completed</h2>
            <div className="space-y-4">
              {completedReviews.slice(0, 5).map((review) => (
                <Card key={review.id}>
                  <CardContent className="py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-apple-gray-900 mb-1">
                          {review.contracts.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-apple-gray-500">
                          <span>Fee: ${review.fee_amount}</span>
                          <span>•</span>
                          <span>{review.paid ? 'Paid' : 'Payment pending'}</span>
                        </div>
                      </div>
                      {getStatusBadge(review.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
