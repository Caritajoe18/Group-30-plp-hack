import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Shield, CheckCircle, XCircle, Clock, Users, FileText, Building2, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: roles, isLoading: rolesLoading } = useUserRole(user?.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isAdmin = roles?.includes('admin');

  useEffect(() => {
    if (!authLoading && !rolesLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, rolesLoading, navigate]);

  const { data: pendingOrgs } = useQuery({
    queryKey: ['pendingOrganizations'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/organizations?status=pending`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch pending organizations');
      }

      return response.json();
    },
    enabled: isAdmin,
  });

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch admin stats');
      }

      return response.json();
    },
    enabled: isAdmin,
  });

  const { data: recentReports } = useQuery({
    queryKey: ['recentReports'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/reports?limit=5`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch recent reports');
      }

      return response.json();
    },
    enabled: isAdmin,
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ orgId, status }: { orgId: string; status: 'verified' | 'rejected' }) => {
      const response = await fetch(`${API_BASE_URL}/admin/organizations/${orgId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          verification_status: status,
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify organization');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Success',
        description: `Organization ${variables.status === 'verified' ? 'verified' : 'rejected'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['pendingOrganizations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (authLoading || rolesLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalReports || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrganizations || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Reports
            </CardTitle>
            <CardDescription>
              Latest incident reports submitted to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!recentReports || recentReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent reports
              </p>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{report.incident_type || 'Incident Report'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      report.status === 'resolved' ? 'default' :
                        report.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organization Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Organization Verifications</CardTitle>
            <CardDescription>
              Review and verify organizations that want to join the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!pendingOrgs || pendingOrgs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending organizations to review
              </p>
            ) : (
              <div className="space-y-4">
                {pendingOrgs.map((org) => (
                  <Card key={org.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{org.name}</h3>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{org.description}</p>
                          <div className="space-y-1 text-sm">
                            <p><strong>Email:</strong> {org.contact_email}</p>
                            {org.contact_phone && <p><strong>Phone:</strong> {org.contact_phone}</p>}
                            {org.address && <p><strong>Address:</strong> {org.address}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => verifyMutation.mutate({ orgId: org.id, status: 'verified' })}
                            disabled={verifyMutation.isPending}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => verifyMutation.mutate({ orgId: org.id, status: 'rejected' })}
                            disabled={verifyMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
