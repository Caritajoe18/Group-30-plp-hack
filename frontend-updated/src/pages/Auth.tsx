import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Eye, EyeOff, } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token');
  const isRecovery = type === 'recovery';


  const { signUp, signIn, user, resetPassword, updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isResetting = searchParams.get('reset') === 'true';
  const returnTo = searchParams.get('returnTo');

  // Redirect if already logged in
  if (user) {
    navigate(returnTo || '/');
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check network connectivity
    if (!navigator.onLine) {
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        // Enhanced error handling for specific auth errors
        let errorTitle = 'Sign Up Error';
        let errorDescription = error.message;

        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          errorTitle = 'Account Already Exists';
          errorDescription = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message?.includes('password')) {
          errorTitle = 'Password Error';
          errorDescription = 'Password must be at least 6 characters long.';
        } else if (error.message?.includes('email')) {
          errorTitle = 'Email Error';
          errorDescription = 'Please enter a valid email address.';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
          errorTitle = 'Network Error';
          errorDescription = 'Please check your internet connection and try again.';
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: 'destructive',
          action: error.message?.includes('already') ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Switch to sign in tab
                const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
                signInTab?.click();
              }}
            >
              Sign In
            </Button>
          ) : undefined,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Account created successfully!',
        });
        navigate(returnTo || '/');
      }
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check network connectivity
    if (!navigator.onLine) {
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        // Enhanced error handling for specific auth errors
        let errorTitle = 'Sign In Error';
        let errorDescription = error.message;

        if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid')) {
          errorTitle = 'Invalid Credentials';
          errorDescription = 'The email or password you entered is incorrect. Please try again.';
        } else if (error.message?.includes('not confirmed') || error.message?.includes('confirm')) {
          errorTitle = 'Email Not Confirmed';
          errorDescription = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message?.includes('too many requests')) {
          errorTitle = 'Too Many Attempts';
          errorDescription = 'Too many sign in attempts. Please wait a few minutes and try again.';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
          errorTitle = 'Network Error';
          errorDescription = 'Please check your internet connection and try again.';
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: 'destructive',
          action: error.message?.includes('credentials') || error.message?.includes('invalid') ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Switch to reset password tab
                const resetTab = document.querySelector('[value="reset"]') as HTMLElement;
                resetTab?.click();
              }}
            >
              Reset Password
            </Button>
          ) : undefined,
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'Signed in successfully',
        });
        navigate(returnTo || '/');
      }
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check network connectivity
    if (!navigator.onLine) {
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        // Enhanced error handling for password reset errors
        let errorTitle = 'Reset Password Error';
        let errorDescription = error.message;

        if (error.message?.includes('not found') || error.message?.includes('invalid email')) {
          errorTitle = 'Email Not Found';
          errorDescription = 'No account found with this email address. Please check your email or sign up for a new account.';
        } else if (error.message?.includes('too many requests')) {
          errorTitle = 'Too Many Requests';
          errorDescription = 'Too many reset attempts. Please wait a few minutes before trying again.';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
          errorTitle = 'Network Error';
          errorDescription = 'Please check your internet connection and try again.';
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: 'destructive',
          action: error.message?.includes('not found') ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Switch to sign up tab
                const signUpTab = document.querySelector('[value="signup"]') as HTMLElement;
                signUpTab?.click();
              }}
            >
              Sign Up
            </Button>
          ) : undefined,
        });
      } else {
        toast({
          title: 'Check your email',
          description: 'Password reset link has been sent to your email. Please check your inbox and spam folder.',
          duration: 7000,
        });
        setEmail('');
      }
    } catch (error: any) {
      toast({
        title: 'Unexpected Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(newPassword);
    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      navigate(returnTo || '/');
    }
  };

  useEffect(() => {
    if (isResetting && user) {
      // User clicked reset link and is authenticated
      toast({
        title: 'Reset your password',
        description: 'Enter your new password below',
      });
    }
  }, [isResetting, user, toast]);

  // Show password reset form if user came from reset link
  if (isResetting && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary mb-4">
              <Shield className="w-8 h-8" />
              <span className="text-2xl font-bold">Talk Safe</span>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter your new password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary mb-4">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-bold">Talk Safe</span>
          </Link>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Sign in to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                  Enter your email to receive a password reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to report incidents and access support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>


                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
