import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, authLoading, navigate]);

  const { data: reports } = useQuery({
    queryKey: ['userReports', user?.id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/reports?reporter_id=${user?.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch reports');
      }

      return response.json();
    },
    enabled: !!user,
  });

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">My Profile</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
              <CardDescription>View all your submitted incident reports</CardDescription>
            </CardHeader>
            <CardContent>
              {!reports || reports.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  You haven't submitted any reports yet
                </p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report: any) => (
                    <Card key={report.id} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-primary" />
                              <span className="font-semibold">
                                {report.is_anonymous ? 'Anonymous Report' : 'Report'}
                              </span>
                              <Badge>{report.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Location:</strong> {report.location}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Organization:</strong> {report.organizations?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.created_at).toLocaleDateString()}
                            </p>
                            {report.enable_chat && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => navigate(`/chat/${report.id}`)}
                              >
                                Open Chat
                              </Button>
                            )}
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
    </div>
  );
};

export default Profile;
