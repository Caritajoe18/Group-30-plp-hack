import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createAdminUser, checkAdminUserStatus, setupAndSignInAdmin } from '@/lib/adminSetup';

const AdminSetup = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [setupResult, setSetupResult] = useState<any>(null);
    const { toast } = useToast();

    const handleCheckStatus = async () => {
        setLoading(true);
        try {
            const result = await checkAdminUserStatus();
            setStatus(result);

            if (result.isProperlySetup) {
                toast({
                    title: "Admin User Ready",
                    description: "Admin user exists and is properly configured.",
                });
            } else {
                toast({
                    title: "Admin Setup Needed",
                    description: "Admin user needs to be created or configured.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Check Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async () => {
        setLoading(true);
        try {
            const result = await createAdminUser(
                "admin@example.com",
                "password"
            );
            setSetupResult(result);

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                });
                // Refresh status
                await handleCheckStatus();
            } else {
                toast({
                    title: "Creation Failed",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Unexpected Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSetup = async () => {
        setLoading(true);
        try {
            const result = await setupAndSignInAdmin(
                "admin@example.com",
                "password"
            );
            setSetupResult(result);

            if (result.success) {
                toast({
                    title: "Complete Success",
                    description: "Admin user created and signed in successfully!",
                });
            } else {
                toast({
                    title: "Setup Failed",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Unexpected Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-primary mb-4">
                        <Shield className="w-8 h-8" />
                        <span className="text-2xl font-bold">Talk Safe</span>
                    </Link>
                    <h1 className="text-3xl font-bold">Admin User Setup</h1>
                    <p className="text-muted-foreground mt-2">
                        Set up the system administrator account
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Admin User Configuration
                        </CardTitle>
                        <CardDescription>
                            Create and configure the admin user account with email: admin@example.com
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Status Display */}
                        {status && (
                            <div className={`p-4 rounded-lg border ${status.isProperlySetup
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-amber-50 border-amber-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {status.isProperlySetup ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-amber-600" />
                                    )}
                                    <h3 className="font-medium">
                                        {status.isProperlySetup ? 'Admin User Ready' : 'Setup Required'}
                                    </h3>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p>User exists: {status.exists ? '✅' : '❌'}</p>
                                    <p>Has admin role: {status.hasAdminRole ? '✅' : '❌'}</p>
                                    {status.userId && <p>User ID: {status.userId}</p>}
                                </div>
                            </div>
                        )}

                        {/* Setup Result */}
                        {setupResult && (
                            <div className={`p-4 rounded-lg border ${setupResult.success
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {setupResult.success ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <h3 className="font-medium">
                                        {setupResult.success ? 'Setup Successful' : 'Setup Failed'}
                                    </h3>
                                </div>
                                <p className="mt-2 text-sm">
                                    {setupResult.message || setupResult.error}
                                </p>
                                {setupResult.suggestion && (
                                    <p className="mt-1 text-sm font-medium">
                                        Suggestion: {setupResult.suggestion}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleCheckStatus}
                                disabled={loading}
                                variant="outline"
                                className="w-full"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                )}
                                Check Admin User Status
                            </Button>

                            <Button
                                onClick={handleCreateAdmin}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Shield className="w-4 h-4 mr-2" />
                                )}
                                Create Admin User
                            </Button>

                            <Button
                                onClick={handleCompleteSetup}
                                disabled={loading}
                                variant="default"
                                className="w-full bg-primary"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                Complete Setup & Sign In
                            </Button>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
                            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                <li>First, check the current admin user status</li>
                                <li>If setup is needed, click "Create Admin User"</li>
                                <li>Use "Complete Setup & Sign In" to create and immediately sign in</li>
                                <li>Admin credentials: admin@example.com / password123</li>
                            </ol>
                        </div>

                        {/* Manual Alternative */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-2">Manual Alternative:</h4>
                            <p className="text-sm text-gray-600 mb-2">
                                If automatic setup fails, you can create the admin user manually:
                            </p>
                            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Go to your Supabase dashboard</li>
                                <li>Navigate to Authentication → Users</li>
                                <li>Click "Add user" and create user with email: admin@example.com</li>
                                <li>Set password to: password123</li>
                                <li>The system will automatically assign admin roles when the user signs in</li>
                            </ol>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" asChild className="flex-1">
                                <Link to="/">Back to Home</Link>
                            </Button>
                            <Button variant="outline" asChild className="flex-1">
                                <Link to="/auth">Go to Sign In</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSetup;