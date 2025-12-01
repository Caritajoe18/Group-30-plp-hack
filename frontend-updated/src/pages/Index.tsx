import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle, Phone, Users, FileText, Lock, LogOut, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import supportIcon from "@/assets/support-icon.jpg";
import GBVInfo from "@/components/GBVInfo";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const { data: roles } = useUserRole(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully',
    });
  };

  const isAdmin = roles?.includes('admin');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Talk Safe</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src={heroImage}
            alt="Protective support"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">Your Safety Matters</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Talk Safe
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A safe space to report incidents, access support services, and get help when you need it most. Your voice matters, and we are here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="emergency" size="xl" asChild>
                <Link to="/emergency">
                  <AlertCircle className="w-5 h-5" />
                  Emergency Assistance
                </Link>
              </Button>
              <Button variant="default" size="xl" asChild>
                <Link to="/report">
                  <FileText className="w-5 h-5" />
                  Report Incident
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* GBV Information Section */}
      <GBVInfo />

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How We Support You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive tools and resources to ensure your safety and wellbeing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Incident Reporting</CardTitle>
                <CardDescription>
                  Securely report incidents with location details, descriptions, and supporting evidence
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Emergency Alerts</CardTitle>
                <CardDescription>
                  Quick access to emergency assistance with instant alerts to authorities and designated contacts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Support Services</CardTitle>
                <CardDescription>
                  Access a comprehensive directory of counseling, legal aid, and medical assistance services
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Anonymous Reporting</CardTitle>
                <CardDescription>
                  Report incidents anonymously to protect your privacy while seeking help
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your information is protected with industry-standard security measures
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Access help and resources anytime, day or night, whenever you need it
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src={supportIcon}
                    alt="Community support"
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    You are Not Alone
                  </h3>
                  <p className="text-muted-foreground">
                    Our community is here to support you. Access resources, connect with professionals, and take the first step towards safety.
                  </p>
                  <div className="space-y-2">
                    <Button variant="default" size="lg" className="w-full" asChild>
                      <Link to="/support">View Support Services</Link>
                    </Button>
                    {user ? (
                      <>
                        <Button variant="outline" size="lg" className="w-full" asChild>
                          <Link to="/register-organization">Register Your Organization</Link>
                        </Button>
                        <Button variant="secondary" size="lg" className="w-full" asChild>
                          <Link to="/organization-dashboard">Organization Dashboard</Link>
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" size="lg" className="w-full" asChild>
                        <Link to="/auth?returnTo=%2Forganization-dashboard">Organization Login</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">Emergency Hotline:</strong> Available 24/7
            </p>
            <p>© 2025 Talk Safe. All rights reserved. Your safety is our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
