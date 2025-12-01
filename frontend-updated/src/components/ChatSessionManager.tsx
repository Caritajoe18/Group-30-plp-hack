import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    MessageCircle,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    RotateCcw,
    MoreHorizontal,
    Eye,
    MessageSquare
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useChatSessions, useChatSession, useSessionLifecycle } from '@/hooks/useChatSession';
import { ChatSessionWithReport } from '@/lib/chatSessionUtils';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface ChatSessionManagerProps {
    isOrganizationView?: boolean;
    organizationId?: string;
    showReportDetails?: boolean;
}

const ChatSessionManager: React.FC<ChatSessionManagerProps> = ({
    isOrganizationView = false,
    organizationId,
    showReportDetails = true,
}) => {
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [sessionToClose, setSessionToClose] = useState<string | null>(null);
    const [sessionToReactivate, setSessionToReactivate] = useState<string | null>(null);

    const { sessions, activeSessions, isLoading, refreshSessions } = useChatSessions(
        isOrganizationView,
        organizationId
    );

    const { bulkCloseSessions, isBulkClosing } = useSessionLifecycle();

    const getStatusBadge = (session: ChatSessionWithReport) => {
        if (session.is_active) {
            return <Badge variant="default" className="bg-green-500">Active</Badge>;
        } else if (session.closed_at) {
            return <Badge variant="secondary">Closed</Badge>;
        } else {
            return <Badge variant="outline">Inactive</Badge>;
        }
    };

    const getStatusColor = (session: ChatSessionWithReport) => {
        if (session.is_active) return 'border-green-200 bg-green-50';
        if (session.closed_at) return 'border-gray-200 bg-gray-50';
        return 'border-yellow-200 bg-yellow-50';
    };

    const handleBulkClose = () => {
        if (selectedSessions.length > 0) {
            bulkCloseSessions(selectedSessions);
            setSelectedSessions([]);
        }
    };

    const toggleSessionSelection = (sessionId: string) => {
        setSelectedSessions(prev =>
            prev.includes(sessionId)
                ? prev.filter(id => id !== sessionId)
                : [...prev, sessionId]
        );
    };

    const selectAllActive = () => {
        const activeSessionIds = activeSessions.map(s => s.id);
        setSelectedSessions(activeSessionIds);
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Total Sessions</p>
                                <p className="text-2xl font-bold">{sessions.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm font-medium">Active Sessions</p>
                                <p className="text-2xl font-bold">{activeSessions.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">Closed Sessions</p>
                                <p className="text-2xl font-bold">
                                    {sessions.filter(s => !s.is_active).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bulk Actions */}
            {activeSessions.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={selectAllActive}
                                    disabled={selectedSessions.length === activeSessions.length}
                                >
                                    Select All Active
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {selectedSessions.length} selected
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={refreshSessions}
                                >
                                    Refresh
                                </Button>
                                {selectedSessions.length > 0 && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBulkClose}
                                        disabled={isBulkClosing}
                                    >
                                        {isBulkClosing ? 'Closing...' : `Close ${selectedSessions.length} Sessions`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Sessions List */}
            <Card>
                <CardHeader>
                    <CardTitle>Chat Sessions</CardTitle>
                    <CardDescription>
                        Manage chat sessions {isOrganizationView ? 'for your organization' : 'for your reports'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No chat sessions found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    isSelected={selectedSessions.includes(session.id)}
                                    onToggleSelect={() => toggleSessionSelection(session.id)}
                                    onClose={() => setSessionToClose(session.id)}
                                    onReactivate={() => setSessionToReactivate(session.id)}
                                    showReportDetails={showReportDetails}
                                    isOrganizationView={isOrganizationView}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Close Session Dialog */}
            <AlertDialog open={!!sessionToClose} onOpenChange={() => setSessionToClose(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Close Chat Session</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to close this chat session? This action cannot be undone,
                            but the session can be reactivated later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (sessionToClose) {
                                    // This would be handled by the individual session hook
                                    setSessionToClose(null);
                                }
                            }}
                        >
                            Close Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reactivate Session Dialog */}
            <AlertDialog open={!!sessionToReactivate} onOpenChange={() => setSessionToReactivate(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reactivate Chat Session</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reactivate this chat session? This will allow
                            new messages to be sent and received.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (sessionToReactivate) {
                                    // This would be handled by the individual session hook
                                    setSessionToReactivate(null);
                                }
                            }}
                        >
                            Reactivate Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

interface SessionCardProps {
    session: ChatSessionWithReport;
    isSelected: boolean;
    onToggleSelect: () => void;
    onClose: () => void;
    onReactivate: () => void;
    showReportDetails: boolean;
    isOrganizationView: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
    session,
    isSelected,
    onToggleSelect,
    onClose,
    onReactivate,
    showReportDetails,
    isOrganizationView,
}) => {
    const { status } = useChatSession(session.report_id);

    const getStatusBadge = () => {
        if (session.is_active) {
            return <Badge variant="default" className="bg-green-500">Active</Badge>;
        } else if (session.closed_at) {
            return <Badge variant="secondary">Closed</Badge>;
        } else {
            return <Badge variant="outline">Inactive</Badge>;
        }
    };

    const getStatusColor = () => {
        if (session.is_active) return 'border-green-200 bg-green-50';
        if (session.closed_at) return 'border-gray-200 bg-gray-50';
        return 'border-yellow-200 bg-yellow-50';
    };

    return (
        <div className={`border rounded-lg p-4 ${getStatusColor()} ${isSelected ? 'ring-2 ring-primary' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className="mt-1"
                        disabled={!session.is_active}
                    />

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            {getStatusBadge()}
                            <span className="text-sm text-muted-foreground">
                                Created {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                            </span>
                            {session.closed_at && (
                                <span className="text-sm text-muted-foreground">
                                    • Closed {formatDistanceToNow(new Date(session.closed_at), { addSuffix: true })}
                                </span>
                            )}
                        </div>

                        {showReportDetails && session.reports && (
                            <div className="space-y-1">
                                <p className="font-medium text-sm">
                                    {session.reports.incident_type || 'General Incident'}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {session.reports.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    📍 {session.reports.location}
                                </p>
                            </div>
                        )}

                        {status && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{status.messageCount} messages</span>
                                </span>
                                {status.unreadCount > 0 && (
                                    <span className="flex items-center space-x-1 text-blue-600">
                                        <span>{status.unreadCount} unread</span>
                                    </span>
                                )}
                                {status.lastActivity && (
                                    <span className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            Last activity {formatDistanceToNow(new Date(status.lastActivity), { addSuffix: true })}
                                        </span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={`/chat/${session.report_id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link to={`/chat/${session.report_id}`}>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Open Chat
                                </Link>
                            </DropdownMenuItem>
                            {session.is_active ? (
                                <DropdownMenuItem onClick={onClose} className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Close Session
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={onReactivate}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reactivate Session
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default ChatSessionManager;