import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for authenticated requests
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

// Mock WebSocket implementation (replace with your actual WebSocket setup)
class WebSocketClient {
    private url: string;
    private socket: WebSocket | null = null;
    private callbacks: Record<string, Function[]> = {};

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const callbacks = this.callbacks[data.event] || [];
            callbacks.forEach(cb => cb(data.payload));
        };

        return new Promise((resolve, reject) => {
            this.socket!.onopen = () => resolve(true);
            this.socket!.onerror = (error) => reject(error);
        });
    }

    on(event: string, callback: Function) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    close() {
        this.socket?.close();
    }
}

// Replace this with your actual WebSocket URL
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

// Mock implementation of getOrganizationMemberNotifications
const getOrganizationMemberNotifications = async (userId: string, organizationId: string) => {
    return fetchWithAuth(`/notifications/organization/${organizationId}/user/${userId}`);
};

interface NotificationData {
    totalUnreadMessages: number;
    unreadSessionsCount: number;
    recentActivity: Array<{
        sessionId: string;
        reportId: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
    }>;
}

interface ChatSessionStatus {
    sessionId: string;
    reportId: string;
    isActive: boolean;
    lastActivity: string;
    unreadCount: number;
    status: 'active' | 'inactive' | 'closed';
}

export const useOrganizationNotifications = (organizationId?: string) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);
    const [chatSessionStatuses, setChatSessionStatuses] = useState<ChatSessionStatus[]>([]);
    const [lastNotificationTime, setLastNotificationTime] = useState<string | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch notification data
    const { data: notifications, refetch } = useQuery({
        queryKey: ['organizationNotifications', user?.id, organizationId],
        queryFn: async (): Promise<NotificationData> => {
            if (!user?.id || !organizationId) {
                return {
                    totalUnreadMessages: 0,
                    unreadSessionsCount: 0,
                    recentActivity: []
                };
            }

            return await getOrganizationMemberNotifications(user.id, organizationId);
        },
        enabled: !!user?.id && !!organizationId,
        refetchInterval: 30000, // Refresh every 30 seconds as fallback
    });

    // Fetch chat session statuses for enhanced status indicators
    const { data: sessionStatuses, refetch: refetchSessionStatuses } = useQuery({
        queryKey: ['organizationChatSessionStatuses', user?.id, organizationId],
        queryFn: async (): Promise<ChatSessionStatus[]> => {
            if (!user?.id || !organizationId) return [];

            const { data: sessions, error } = await supabase
                .from('chat_sessions')
                .select(`
                    id,
                    report_id,
                    is_active,
                    created_at,
                    closed_at
                `)
                .eq('organization_id', organizationId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Get unread counts and last activity for each session
            const statusPromises = sessions?.map(async (session) => {
                // Get unread count for this session
                const { data: unreadMessages, error: unreadError } = await supabase
                    .from('chat_messages')
                    .select('id, created_at')
                    .eq('session_id', session.id)
                    .eq('is_read', false)
                    .neq('sender_id', user.id);

                if (unreadError) throw unreadError;

                // Get last message time
                const { data: lastMessage, error: lastMessageError } = await supabase
                    .from('chat_messages')
                    .select('created_at')
                    .eq('session_id', session.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                const lastActivity = lastMessage?.created_at || session.created_at;
                const unreadCount = unreadMessages?.length || 0;

                let status: 'active' | 'inactive' | 'closed' = 'inactive';
                if (session.closed_at) {
                    status = 'closed';
                } else if (session.is_active) {
                    // Consider active if there's been activity in the last 24 hours
                    const lastActivityTime = new Date(lastActivity);
                    const now = new Date();
                    const hoursSinceActivity = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60 * 60);
                    status = hoursSinceActivity < 24 ? 'active' : 'inactive';
                }

                return {
                    sessionId: session.id,
                    reportId: session.report_id,
                    isActive: session.is_active || false,
                    lastActivity,
                    unreadCount,
                    status
                };
            }) || [];

            return await Promise.all(statusPromises);
        },
        enabled: !!user?.id && !!organizationId,
        refetchInterval: 15000, // Refresh every 15 seconds for status updates
    });

    // Enhanced real-time subscription for new messages with better error handling
    const setupRealtimeSubscription = useCallback(() => {
        if (!organizationId || !user?.id) return;

        // Clean up existing channel
        if (channel) {
            supabase.removeChannel(channel);
        }

        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        const newChannel = supabase
            .channel(`org_notifications_${organizationId}_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                },
                async (payload) => {
                    const newMessage = payload.new as any;

                    // Check if this message is for a session in our organization
                    const { data: session } = await supabase
                        .from('chat_sessions')
                        .select('organization_id, report_id, reports!inner(incident_type)')
                        .eq('id', newMessage.session_id)
                        .eq('organization_id', organizationId)
                        .single();

                    if (session && newMessage.sender_id !== user.id) {
                        // This is a new message in our organization's chat session from someone else
                        const reportType = session.reports?.incident_type || 'incident';
                        const shortReportId = session.report_id.slice(0, 8);

                        // Show enhanced toast notification
                        toast({
                            title: 'New Message Received',
                            description: `New message in ${reportType} report ${shortReportId}...`,
                            duration: 8000,
                        });

                        // Update last notification time
                        setLastNotificationTime(new Date().toISOString());

                        // Refresh notification data
                        refetch();
                        refetchSessionStatuses();

                        // Invalidate related queries
                        queryClient.invalidateQueries({ queryKey: ['organizationChatSessions'] });
                        queryClient.invalidateQueries({ queryKey: ['organizationUnreadCounts'] });
                        queryClient.invalidateQueries({ queryKey: ['organizationReports'] });
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: 'is_read=eq.true',
                },
                () => {
                    // Message was marked as read, refresh counts
                    refetch();
                    refetchSessionStatuses();
                    queryClient.invalidateQueries({ queryKey: ['organizationUnreadCounts'] });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_sessions',
                },
                async (payload) => {
                    const newSession = payload.new as any;

                    if (newSession.organization_id === organizationId) {
                        // New chat session created for our organization
                        toast({
                            title: 'New Chat Session',
                            description: `A new chat session has been started for report ${newSession.report_id.slice(0, 8)}...`,
                            duration: 6000,
                        });

                        // Refresh all related data
                        refetch();
                        refetchSessionStatuses();
                        queryClient.invalidateQueries({ queryKey: ['organizationChatSessions'] });
                        queryClient.invalidateQueries({ queryKey: ['organizationReports'] });
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'chat_sessions',
                },
                async (payload) => {
                    const updatedSession = payload.new as any;

                    if (updatedSession.organization_id === organizationId) {
                        // Chat session status changed
                        refetchSessionStatuses();
                        queryClient.invalidateQueries({ queryKey: ['organizationChatSessions'] });
                    }
                }
            )
            .on('system', {}, (status) => {
                if (status.event === 'SYSTEM') {
                    const connected = status.type === 'CONNECTED';
                    setIsConnected(connected);

                    if (!connected) {
                        // Connection lost, attempt to reconnect after delay
                        reconnectTimeoutRef.current = setTimeout(() => {
                            setupRealtimeSubscription();
                        }, 5000);
                    }
                }
            })
            .subscribe((status) => {
                const connected = status === 'SUBSCRIBED';
                setIsConnected(connected);

                if (!connected && status === 'CHANNEL_ERROR') {
                    // Subscription failed, attempt to reconnect
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setupRealtimeSubscription();
                    }, 3000);
                }
            });

        setChannel(newChannel);
    }, [organizationId, user?.id, toast, refetch, refetchSessionStatuses, queryClient, channel]);

    // Set up subscription when dependencies change
    useEffect(() => {
        setupRealtimeSubscription();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [setupRealtimeSubscription]);

    // Update chat session statuses when session data changes
    useEffect(() => {
        if (sessionStatuses) {
            setChatSessionStatuses(sessionStatuses);
        }
    }, [sessionStatuses]);

    // Manual refresh function with enhanced invalidation
    const refreshNotifications = useCallback(() => {
        refetch();
        refetchSessionStatuses();
        queryClient.invalidateQueries({ queryKey: ['organizationChatSessions'] });
        queryClient.invalidateQueries({ queryKey: ['organizationUnreadCounts'] });
        queryClient.invalidateQueries({ queryKey: ['organizationReports'] });
        queryClient.invalidateQueries({ queryKey: ['organizationChatSessionStatuses'] });
    }, [refetch, refetchSessionStatuses, queryClient]);

    // Get session status by ID
    const getSessionStatus = useCallback((sessionId: string): ChatSessionStatus | undefined => {
        return chatSessionStatuses.find(status => status.sessionId === sessionId);
    }, [chatSessionStatuses]);

    // Get unread count for a specific session
    const getSessionUnreadCount = useCallback((sessionId: string): number => {
        const status = getSessionStatus(sessionId);
        return status?.unreadCount || 0;
    }, [getSessionStatus]);

    // Check if there are any high-priority notifications (recent messages)
    const hasHighPriorityNotifications = useCallback((): boolean => {
        if (!notifications?.recentActivity.length) return false;

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return notifications.recentActivity.some(activity =>
            new Date(activity.lastMessageTime) > fiveMinutesAgo
        );
    }, [notifications]);

    return {
        notifications: notifications || {
            totalUnreadMessages: 0,
            unreadSessionsCount: 0,
            recentActivity: []
        },
        chatSessionStatuses,
        isConnected,
        lastNotificationTime,
        refreshNotifications,
        getSessionStatus,
        getSessionUnreadCount,
        hasHighPriorityNotifications,
    };
};

export default useOrganizationNotifications;