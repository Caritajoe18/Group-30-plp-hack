import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Phone, MapPin, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Emergency = () => {
  const [isAlertSent, setIsAlertSent] = useState(false);

  const handleEmergencyAlert = () => {
    setIsAlertSent(true);
    toast.success("Emergency alert sent! Help is on the way.");
    
    // Simulate notifying authorities
    setTimeout(() => {
      toast.info("Authorities have been notified of your location");
    }, 2000);
  };

  const handleCallHotline = () => {
    toast.info("Connecting to emergency hotline...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Emergency Assistance</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Alert Status */}
          {isAlertSent && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Alert Sent Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Your emergency alert has been sent to nearby authorities and your designated emergency contacts. 
                      Help is on the way.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Immediate Actions
              </CardTitle>
              <CardDescription>
                Choose the type of assistance you need right now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="emergency" 
                size="xl" 
                className="w-full"
                onClick={handleEmergencyAlert}
                disabled={isAlertSent}
              >
                <AlertCircle className="w-5 h-5" />
                Send Emergency Alert
              </Button>

              <Button 
                variant="default" 
                size="xl" 
                className="w-full"
                onClick={handleCallHotline}
              >
                <Phone className="w-5 h-5" />
                Call Emergency Hotline
              </Button>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Your Location</p>
                    <p className="text-sm text-muted-foreground">
                      Location services enabled - authorities will be able to locate you quickly
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Hotlines */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Hotlines</CardTitle>
              <CardDescription>
                24/7 support lines available for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">National Emergency Line</h4>
                      <p className="text-sm text-muted-foreground">Available 24/7 for all emergencies</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Crisis Counseling</h4>
                      <p className="text-sm text-muted-foreground">Confidential support and guidance</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Legal Aid Hotline</h4>
                      <p className="text-sm text-muted-foreground">Free legal consultation</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Move to a safe location if possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Keep your phone charged and accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Trust your instincts - if something feels wrong, seek help immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Document any evidence if it's safe to do so</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Emergency;
