import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { validateSessionAccess } from '@/hooks/useChatSession';
// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MessageSquare, Users, Clock, Filter, Bell, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrganizationNotifications } from '@/hooks/useOrganizationNotifications';

type UnreadCounts = Record<string, number>;

const OrganizationDashboard = () => {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  const [reportFilter, setReportFilter] = useState<'all' | 'chat_enabled' | 'active_chats'>('all');

  // Check if user is an organization member
  const { data: memberOrgs, isLoading: orgLoading } = useQuery({
    queryKey: ['organizationMemberships', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const response = await fetch(`${API_BASE_URL}/organization-members?user_id=${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}` // Using token from session
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organization memberships');
      }

      return await response.json();
    },
    enabled: !!user,
  });

  // Fetch reports for all organizations the user belongs to
  const { data: reports, refetch } = useQuery({
    queryKey: ['organizationReports', user?.id, selectedOrgId],
    queryFn: async () => {
      if (!user || !memberOrgs?.length) return [];

      const orgIds = selectedOrgId === 'all'
        ? memberOrgs.map(m => m.organization_id)
        : [selectedOrgId];

      const response = await fetch(`${API_BASE_URL}/organizations/reports?org_ids=${orgIds.join(',')}`, {
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
    enabled: !!user && !!memberOrgs?.length,
  });

  // Fetch chat sessions for organization members
  const { data: chatSessions, refetch: refetchChatSessions } = useQuery({
    queryKey: ['organizationChatSessions', user?.id, selectedOrgId],
    queryFn: async () => {
      if (!user || !memberOrgs?.length) return [];

      const orgIds = selectedOrgId === 'all'
        ? memberOrgs.map(m => m.organization_id)
        : [selectedOrgId];

      // Get all chat sessions for the organization(s)
      const response = await fetch(`${API_BASE_URL}/organizations/chat-sessions?org_ids=${orgIds.join(',')}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch chat sessions');
      }

      return response.json();
    },
    enabled: !!user && !!memberOrgs?.length,
  });

  // Get unread message counts for organization
  const { data: unreadCounts } = useQuery<UnreadCounts>({
    queryKey: ['organizationUnreadCounts', user?.id, selectedOrgId],
    queryFn: async () => {
      if (!user || !memberOrgs?.length || !chatSessions?.length) return {};

      const sessionIds = chatSessions.map(s => s.id);

      const response = await fetch(`${API_BASE_URL}/chat/unread-counts?session_ids=${sessionIds.join(',')}&user_id=${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch unread counts');
      }

      return response.json();
    },
    enabled: !!user && !!memberOrgs?.length && !!chatSessions?.length,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
    }

    if (!authLoading && !orgLoading && user && memberOrgs?.length === 0) {
      toast({
        title: 'Access Denied',
        description: 'You are not a member of any organization',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, authLoading, orgLoading, memberOrgs, navigate, toast]);

  // Set default organization if only one membership
  useEffect(() => {
    if (memberOrgs?.length === 1 && selectedOrgId === 'all') {
      setSelectedOrgId(memberOrgs[0].organization_id);
    }
  }, [memberOrgs, selectedOrgId]);

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }

      toast({
        title: 'Success',
        description: 'Report status updated',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Check if user has access to a specific chat session
  const checkChatAccess = async (sessionId: string) => {
    if (!user) return false;

    try {
      const access = await validateSessionAccess(sessionId, user.id);
      return access.hasAccess;
    } catch (error) {
      console.error('Error checking chat access:', error);
      return false;
    }
  };

  // Filter reports based on selected filter
  const getFilteredReports = () => {
    if (!reports) return [];

    switch (reportFilter) {
      case 'chat_enabled':
        return reports.filter(report => report.enable_chat && !report.is_anonymous);
      case 'active_chats':
        const activeChatReportIds = chatSessions
          ?.filter(session => session.is_active)
          ?.map(session => session.report_id) || [];
        return reports.filter(report => activeChatReportIds.includes(report.id));
      default:
        return reports;
    }
  };

  // Get chat session for a report
  const getChatSessionForReport = (reportId: string) => {
    return chatSessions?.find(session => session.report_id === reportId);
  };

  // Get unread count for a session
  const getUnreadCount = (sessionId: string) => {
    return unreadCounts?.[sessionId] || 0;
  };

  if (authLoading || orgLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const statusColors = {
    submitted: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500',
  };

  const filteredReports = getFilteredReports();
  const activeChatSessions = chatSessions?.filter(session => session.is_active) || [];
  const totalUnreadMessages = unreadCounts
    ? Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  // Get organization member chat statistics
  const { data: chatStatistics } = useQuery({
    queryKey: ['organizationChatStatistics', user?.id, selectedOrgId],
    queryFn: async () => {
      // chatSessionUtils implementation pending
      return null;
    },
    enabled: !!user && !!selectedOrgId && selectedOrgId !== 'all',
    refetchInterval: 60000, // Refresh every minute
  });

  // Use enhanced notification hook for real-time updates
  const {
    notifications,
    chatSessionStatuses,
    isConnected,
    lastNotificationTime,
    refreshNotifications,
    getSessionStatus,
    getSessionUnreadCount,
    hasHighPriorityNotifications
  } = useOrganizationNotifications(
    selectedOrgId === 'all' ? undefined : selectedOrgId
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Organization Dashboard</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Organization Selection and Stats */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">Organization Dashboard</h2>
              {/* Real-time connection status */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs">Offline</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Enhanced notification indicator */}
              {notifications.totalUnreadMessages > 0 && (
                <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${hasHighPriorityNotifications()
                  ? 'bg-red-50 border-red-200 animate-pulse'
                  : 'bg-orange-50 border-orange-200'
                  }`}>
                  <Bell className={`w-4 h-4 ${hasHighPriorityNotifications() ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  <span className={`text-sm font-medium ${hasHighPriorityNotifications() ? 'text-red-600' : 'text-orange-600'
                    }`}>
                    {notifications.totalUnreadMessages} new message{notifications.totalUnreadMessages > 1 ? 's' : ''}
                    {hasHighPriorityNotifications() && ' (Recent)'}
                  </span>
                </div>
              )}

              {/* Connection status with last update time */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-3 h-3" />
                    <span>Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <WifiOff className="w-3 h-3" />
                    <span>Offline</span>
                  </div>
                )}
                {lastNotificationTime && (
                  <span>
                    Last update: {new Date(lastNotificationTime).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Refresh button */}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshNotifications}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>

              {/* Organization selector */}
              {memberOrgs && memberOrgs.length > 1 && (
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {memberOrgs.map((membership) => (
                      <SelectItem key={membership.id} value={membership.organization_id}>
                        {membership.organizations?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold">{reports?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Chats</p>
                    <p className="text-2xl font-bold">
                      {chatStatistics?.totalActiveSessions || activeChatSessions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Unread Messages</p>
                    <p className="text-2xl font-bold">
                      {selectedOrgId === 'all' ? totalUnreadMessages :
                        chatStatistics?.totalUnreadMessages || notifications.totalUnreadMessages}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold">
                      {chatStatistics?.highPriorityChats || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Handled Today</p>
                    <p className="text-2xl font-bold">
                      {chatStatistics?.sessionsHandledToday || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            {memberOrgs?.map((membership) => (
              <Badge key={membership.id} variant="secondary" className="text-sm">
                {membership.organizations?.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Activity Notification Panel */}
        {notifications.recentActivity.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-orange-800">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.recentActivity.slice(0, 3).map((activity) => (
                  <div key={activity.sessionId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Report {activity.reportId.slice(0, 8)}... has {activity.unreadCount} new message{activity.unreadCount > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-md">
                        Latest: {activity.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.lastMessageTime).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/chat/${activity.reportId}`}>
                        View Chat
                      </Link>
                    </Button>
                  </div>
                ))}
                {notifications.recentActivity.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {notifications.recentActivity.length - 3} more active conversation{notifications.recentActivity.length - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">All Reports</TabsTrigger>
            <TabsTrigger value="chats">
              Active Chats
              {notifications.unreadSessionsCount > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {notifications.unreadSessionsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Incident Reports</CardTitle>
                    <CardDescription>
                      Manage reports submitted to your organizations
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <Select value={reportFilter} onValueChange={(value: any) => setReportFilter(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="chat_enabled">Chat Enabled</SelectItem>
                        <SelectItem value="active_chats">Active Chats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!filteredReports || filteredReports.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No reports found for the selected filter
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => {
                      const chatSession = getChatSessionForReport(report.id);
                      const unreadCount = chatSession ? getUnreadCount(chatSession.id) : 0;

                      return (
                        <Card key={report.id} className="border-2">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{report.incident_type}</Badge>
                                  <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                                    {report.status}
                                  </Badge>
                                  {report.is_anonymous && (
                                    <Badge variant="secondary">Anonymous</Badge>
                                  )}
                                  {report.enable_chat && (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                      Chat Enabled
                                    </Badge>
                                  )}
                                  {chatSession && (() => {
                                    const sessionStatus = getSessionStatus(chatSession.id);
                                    const statusClass = sessionStatus?.status === 'active'
                                      ? 'text-green-600 border-green-600'
                                      : sessionStatus?.status === 'closed'
                                        ? 'text-gray-600 border-gray-600'
                                        : 'text-orange-600 border-orange-600';

                                    return (
                                      <Badge variant="outline" className={statusClass}>
                                        {sessionStatus?.status === 'active' ? 'Active Chat' :
                                          sessionStatus?.status === 'closed' ? 'Chat Closed' :
                                            'Chat Inactive'}
                                      </Badge>
                                    );
                                  })()}
                                </div>
                                <p className="font-medium mb-2">{report.description}</p>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p><strong>Location:</strong> {report.location}</p>
                                  {report.contact_name && (
                                    <p><strong>Contact:</strong> {report.contact_name}</p>
                                  )}
                                  {report.contact_email && (
                                    <p><strong>Email:</strong> {report.contact_email}</p>
                                  )}
                                  <p><strong>Submitted:</strong> {new Date(report.created_at).toLocaleString()}</p>
                                  {chatSession && (() => {
                                    const sessionStatus = getSessionStatus(chatSession.id);
                                    return (
                                      <div>
                                        <p><strong>Chat Created:</strong> {new Date(chatSession.created_at).toLocaleString()}</p>
                                        {sessionStatus && (
                                          <p><strong>Last Activity:</strong> {new Date(sessionStatus.lastActivity).toLocaleString()}</p>
                                        )}
                                        {sessionStatus?.status === 'closed' && chatSession.closed_at && (
                                          <p><strong>Chat Closed:</strong> {new Date(chatSession.closed_at).toLocaleString()}</p>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Select
                                  value={report.status}
                                  onValueChange={(value) => handleStatusUpdate(report.id, value)}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                                {report.enable_chat && chatSession && (() => {
                                  const sessionStatus = getSessionStatus(chatSession.id);
                                  const sessionUnreadCount = getSessionUnreadCount(chatSession.id);
                                  const isActive = sessionStatus?.status === 'active';

                                  return (
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        size="sm"
                                        variant={sessionUnreadCount > 0 ? "default" : "outline"}
                                        className={!isActive ? "opacity-75" : ""}
                                        asChild
                                      >
                                        <Link to={`/chat/${report.id}`}>
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          {sessionUnreadCount > 0 ? `Chat (${sessionUnreadCount})` : 'Chat'}
                                          {sessionUnreadCount > 0 && (
                                            <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                                              {sessionUnreadCount}
                                            </Badge>
                                          )}
                                        </Link>
                                      </Button>
                                      {isActive && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs"
                                          onClick={async () => {
                                            try {
                                              // chatSessionUtils implementation pending
                                              toast({
                                                title: 'Chat closing functionality coming soon',
                                                description: 'The chat session has been closed successfully.',
                                              });
                                              refetch();
                                              refetchChatSessions();
                                            } catch (error) {
                                              toast({
                                                title: 'Error',
                                                description: error instanceof Error ? error.message : 'Failed to close chat session',
                                                variant: 'destructive',
                                              });
                                            }
                                          }}
                                        >
                                          Close Chat
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })()}
                                {report.enable_chat && !chatSession && (
                                  <div className="flex flex-col gap-1">
                                    <Badge variant="outline" className="text-gray-500 border-gray-300 text-center py-2">
                                      No Chat Session
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Waiting for reporter to start chat
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Chat Sessions</CardTitle>
                <CardDescription>
                  Manage ongoing conversations with reporters
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!activeChatSessions || activeChatSessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No active chat sessions found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activeChatSessions.map((session) => {
                      const unreadCount = getUnreadCount(session.id);
                      const report = session.reports;

                      return (
                        <Card key={session.id} className="border-2">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{report?.incident_type}</Badge>
                                  <Badge className={statusColors[report?.status as keyof typeof statusColors]}>
                                    {report?.status}
                                  </Badge>
                                  {(() => {
                                    const sessionStatus = getSessionStatus(session.id);
                                    const statusClass = sessionStatus?.status === 'active'
                                      ? 'text-green-600 border-green-600'
                                      : sessionStatus?.status === 'closed'
                                        ? 'text-gray-600 border-gray-600'
                                        : 'text-orange-600 border-orange-600';

                                    return (
                                      <Badge variant="outline" className={statusClass}>
                                        {sessionStatus?.status === 'active' ? 'Active Chat' :
                                          sessionStatus?.status === 'closed' ? 'Chat Closed' :
                                            'Chat Inactive'}
                                      </Badge>
                                    );
                                  })()}
                                  {unreadCount > 0 && (
                                    <Badge variant="destructive" className="animate-pulse">
                                      {unreadCount} unread
                                    </Badge>
                                  )}
                                  {/* Enhanced real-time status indicator */}
                                  {isConnected && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                      <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        Live
                                      </div>
                                    </Badge>
                                  )}
                                  {/* Session activity indicator */}
                                  {(() => {
                                    const sessionStatus = getSessionStatus(session.id);
                                    if (sessionStatus) {
                                      const lastActivity = new Date(sessionStatus.lastActivity);
                                      const now = new Date();
                                      const minutesAgo = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));

                                      if (minutesAgo < 5) {
                                        return (
                                          <Badge variant="outline" className="text-green-600 border-green-600">
                                            Active now
                                          </Badge>
                                        );
                                      } else if (minutesAgo < 60) {
                                        return (
                                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                                            {minutesAgo}m ago
                                          </Badge>
                                        );
                                      }
                                    }
                                    return null;
                                  })()}
                                </div>
                                <p className="font-medium mb-2">{report?.description}</p>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p><strong>Location:</strong> {report?.location}</p>
                                  {report?.contact_name && (
                                    <p><strong>Contact:</strong> {report?.contact_name}</p>
                                  )}
                                  <p><strong>Chat Started:</strong> {new Date(session.created_at).toLocaleString()}</p>
                                  <p><strong>Report Submitted:</strong> {report?.created_at && new Date(report.created_at).toLocaleString()}</p>
                                  {(() => {
                                    const sessionStatus = getSessionStatus(session.id);
                                    if (sessionStatus) {
                                      return (
                                        <div>
                                          <p><strong>Last Activity:</strong> {new Date(sessionStatus.lastActivity).toLocaleString()}</p>
                                          <p><strong>Session Status:</strong>
                                            <span className={`ml-1 font-medium ${sessionStatus.status === 'active' ? 'text-green-600' :
                                              sessionStatus.status === 'closed' ? 'text-gray-600' :
                                                'text-orange-600'
                                              }`}>
                                              {sessionStatus.status.charAt(0).toUpperCase() + sessionStatus.status.slice(1)}
                                            </span>
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {(() => {
                                  const sessionStatus = getSessionStatus(session.id);
                                  const sessionUnreadCount = getSessionUnreadCount(session.id);
                                  const isActive = sessionStatus?.status === 'active';

                                  return (
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        size="sm"
                                        variant={sessionUnreadCount > 0 ? "default" : "outline"}
                                        className={!isActive ? "opacity-75" : ""}
                                        asChild
                                      >
                                        <Link to={`/chat/${report?.id}`}>
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          {sessionUnreadCount > 0 ? `Reply (${sessionUnreadCount})` : 'View Chat'}
                                          {sessionUnreadCount > 0 && (
                                            <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                          )}
                                        </Link>
                                      </Button>
                                      {isActive && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs"
                                          onClick={async () => {
                                            try {
                                              // chatSessionUtils implementation pending
                                              toast({
                                                title: 'Chat closing functionality coming soon',
                                                description: 'The chat session has been closed successfully.',
                                              });
                                              refetch();
                                              refetchChatSessions();
                                            } catch (error) {
                                              toast({
                                                title: 'Error',
                                                description: error instanceof Error ? error.message : 'Failed to close chat session',
                                                variant: 'destructive',
                                              });
                                            }
                                          }}
                                        >
                                          Close Chat
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* Quick action indicators */}
                                {(() => {
                                  const sessionStatus = getSessionStatus(session.id);
                                  if (sessionStatus?.status === 'inactive') {
                                    return (
                                      <div className="text-xs text-muted-foreground text-center">
                                        Session may need attention
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
