import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ChatSession {
    id: string;
    reportId: string;
    status: 'active' | 'closed' | 'inactive';
    createdAt: string;
    updatedAt: string;
    // Add other properties as needed
}

interface ChatSessionWithReport extends ChatSession {
    report: {
        id: string;
        title: string;
        description: string;
        status: string;
        // Add other report properties
    };
}

interface ChatSessionStatus {
    sessionId: string;
    status: 'active' | 'closed' | 'inactive';
    lastActivity: string;
    unreadCount: number;
}

// API functions
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
};

export const getChatSessionByReportId = async (reportId: string) => {
    return fetchWithAuth(`/chat-sessions/report/${reportId}`);
};

const getChatSessionsWithReports = async (userId: string) => {
    return fetchWithAuth(`/chat-sessions/user/${userId}`);
};

const getActiveChatSessions = async (organizationId?: string) => {
    const url = organizationId
        ? `/chat-sessions/active?organizationId=${organizationId}`
        : '/chat-sessions/active';
    return fetchWithAuth(url);
};

const getChatSessionStatus = async (sessionId: string) => {
    return fetchWithAuth(`/chat-sessions/${sessionId}/status`);
};

const closeChatSession = async (sessionId: string, userId: string) => {
    return fetchWithAuth(`/chat-sessions/${sessionId}/close`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
};

const reactivateChatSession = async (sessionId: string, userId: string) => {
    return fetchWithAuth(`/chat-sessions/${sessionId}/reactivate`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
};

export function validateSessionAccess(sessionId: string, userId: string) {
    return fetchWithAuth(`/chat-sessions/${sessionId}/validate-access?userId=${userId}`);
};

const ensureChatSession = async (reportId: string, userId: string) => {
    return fetchWithAuth('/chat-sessions/ensure', {
        method: 'POST',
        body: JSON.stringify({ reportId, userId })
    });
};

/**
 * Hook for managing a single chat session
 */
export const useChatSession = (reportId?: string) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const sessionQuery = useQuery({
        queryKey: ['chatSession', reportId],
        queryFn: () => reportId ? getChatSessionByReportId(reportId) : null,
        enabled: !!reportId,
    });

    const statusQuery = useQuery({
        queryKey: ['chatSessionStatus', sessionQuery.data?.id],
        queryFn: () => sessionQuery.data ? getChatSessionStatus(sessionQuery.data.id) : null,
        enabled: !!sessionQuery.data?.id,
        refetchInterval: 30000, // Refresh status every 30 seconds
    });

    const accessQuery = useQuery({
        queryKey: ['chatSessionAccess', sessionQuery.data?.id, user?.id],
        queryFn: () =>
            sessionQuery.data && user
                ? validateSessionAccess(sessionQuery.data.id, user.id)
                : null,
        enabled: !!sessionQuery.data?.id && !!user?.id,
    });

    const closeMutation = useMutation({
        mutationFn: (sessionId: string) => closeChatSession(sessionId, user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatSession'] });
            queryClient.invalidateQueries({ queryKey: ['chatSessionStatus'] });
            toast({
                title: 'Chat Closed',
                description: 'The chat session has been closed successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Failed to close chat session: ${error.message}`,
                variant: 'destructive',
            });
        },
    });

    const reactivateMutation = useMutation({
        mutationFn: (sessionId: string) => reactivateChatSession(sessionId, user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatSession'] });
            queryClient.invalidateQueries({ queryKey: ['chatSessionStatus'] });
            toast({
                title: 'Chat Reactivated',
                description: 'The chat session has been reactivated successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Failed to reactivate chat session: ${error.message}`,
                variant: 'destructive',
            });
        },
    });

    const ensureSessionMutation = useMutation({
        mutationFn: ({ reportId, reporterId, organizationId }: {
            reportId: string;
            reporterId: string;
            organizationId: string;
        }) => ensureChatSession(reportId, reporterId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatSession'] });
            toast({
                title: 'Chat Ready',
                description: 'Chat session is now available for this report.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Failed to setup chat session: ${error.message}`,
                variant: 'destructive',
            });
        },
    });

    return {
        session: sessionQuery.data,
        status: statusQuery.data,
        access: accessQuery.data,
        isLoading: sessionQuery.isLoading || statusQuery.isLoading || accessQuery.isLoading,
        error: sessionQuery.error || statusQuery.error || accessQuery.error,
        closeSession: closeMutation.mutate,
        reactivateSession: reactivateMutation.mutate,
        ensureSession: ensureSessionMutation.mutate,
        isClosing: closeMutation.isPending,
        isReactivating: reactivateMutation.isPending,
        isEnsuring: ensureSessionMutation.isPending,
    };
};

/**
 * Hook for managing multiple chat sessions for a user
 */
export const useChatSessions = (isOrganizationMember: boolean = false, organizationId?: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const sessionsQuery = useQuery({
        queryKey: ['chatSessions', user?.id, isOrganizationMember, organizationId],
        queryFn: () =>
            user
                ? getChatSessionsWithReports(user.id)
                : [],
        enabled: !!user,
        refetchInterval: 60000, // Refresh every minute
    });

    const activeSessionsQuery = useQuery({
        queryKey: ['activeChatSessions', user?.id, isOrganizationMember, organizationId],
        queryFn: () =>
            user
                ? getActiveChatSessions(user.id)
                : [],
        enabled: !!user,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const refreshSessions = () => {
        queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
        queryClient.invalidateQueries({ queryKey: ['activeChatSessions'] });
    };

    return {
        sessions: sessionsQuery.data || [],
        activeSessions: activeSessionsQuery.data || [],
        isLoading: sessionsQuery.isLoading || activeSessionsQuery.isLoading,
        error: sessionsQuery.error || activeSessionsQuery.error,
        refreshSessions,
    };
};

/**
 * Hook for session lifecycle management
 */
export const useSessionLifecycle = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const bulkCloseMutation = useMutation({
        mutationFn: async (sessionIds: string[]) => {
            const results = [];
            for (const sessionId of sessionIds) {
                try {
                    await closeChatSession(sessionId, "123");
                    results.push({ sessionId, success: true });
                } catch (error) {
                    results.push({
                        sessionId,
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
            return results;
        },
        onSuccess: (results) => {
            const successful = results.filter(r => r.success).length;
            const failed = results.filter(r => !r.success).length;

            queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
            queryClient.invalidateQueries({ queryKey: ['activeChatSessions'] });

            if (failed === 0) {
                toast({
                    title: 'Success',
                    description: `${successful} chat session${successful > 1 ? 's' : ''} closed successfully.`,
                });
            } else {
                toast({
                    title: 'Partial Success',
                    description: `${successful} sessions closed, ${failed} failed.`,
                    variant: 'destructive',
                });
            }
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Failed to close sessions: ${error.message}`,
                variant: 'destructive',
            });
        },
    });

    return {
        bulkCloseSessions: bulkCloseMutation.mutate,
        isBulkClosing: bulkCloseMutation.isPending,
    };
};