import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, FileText, Upload, MessageCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const ReportIncident = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [enableChat, setEnableChat] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [formData, setFormData] = useState({
    incidentType: "",
    location: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Enhanced form state management with validation
  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    validateField(field, value);
  };

  // Clear contact information when switching to anonymous
  const handleAnonymousToggle = (checked: boolean) => {
    const newAnonymous = checked as boolean;
    setIsAnonymous(newAnonymous);

    // Disable chat when switching to anonymous
    if (newAnonymous) {
      setEnableChat(false);
      // Clear contact information for anonymous reports
      setFormData(prev => ({
        ...prev,
        contactName: "",
        contactEmail: "",
        contactPhone: "",
      }));
    }
  };

  useEffect(() => {
    // Handle URL parameters for anonymous reporting
    const anonymousParam = searchParams.get('anonymous');

    // If user is logged in, they can choose anonymous or non-anonymous
    // If user is not logged in, force anonymous and disable the toggle
    if (!authLoading && !user) {
      setIsAnonymous(true);
      setEnableChat(false); // Disable chat for unauthenticated users
    } else if (!authLoading && user && anonymousParam === 'true') {
      // If authenticated user comes with anonymous=true parameter, set anonymous mode
      setIsAnonymous(true);
      setEnableChat(false);
    }
  }, [user, authLoading, searchParams]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRetryAttempts(0);
      toast({
        title: "Connection Restored",
        description: "You're back online. You can now submit reports.",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "You're offline. Please check your internet connection.",
        variant: "destructive",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);


  const { data: organizations } = useQuery({
    queryKey: ['verifiedOrganizations'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/organizations?verified=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      const defaultOrg = organizations.find(org => org.is_default);
      if (defaultOrg) {
        setSelectedOrg(defaultOrg.id);
      }
    }
  }, [organizations]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = { ...fieldErrors };

    switch (field) {
      case 'description':
        if (!value.trim()) {
          errors.description = "Incident description is required";
        } else if (value.trim().length < 10) {
          errors.description = "Please provide more details (at least 10 characters)";
        } else if (value.length > 2000) {
          errors.description = "Description is too long (maximum 2000 characters)";
        } else {
          delete errors.description;
        }
        break;

      case 'location':
        if (!value.trim()) {
          errors.location = "Location is required";
        } else if (value.trim().length < 3) {
          errors.location = "Please provide a more specific location";
        } else {
          delete errors.location;
        }
        break;

      case 'contactName':
        if (enableChat && !isAnonymous) {
          if (!value.trim()) {
            errors.contactName = "Name is required when chat is enabled";
          } else if (value.trim().length < 2) {
            errors.contactName = "Please enter your full name";
          } else {
            delete errors.contactName;
          }
        } else {
          delete errors.contactName;
        }
        break;

      case 'contactEmail':
        if (enableChat && !isAnonymous) {
          if (!value.trim()) {
            errors.contactEmail = "Email is required when chat is enabled";
          } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value.trim())) {
              errors.contactEmail = "Please enter a valid email address";
            } else {
              delete errors.contactEmail;
            }
          }
        } else if (value.trim()) {
          // Optional email validation for non-chat reports
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            errors.contactEmail = "Please enter a valid email address";
          } else {
            delete errors.contactEmail;
          }
        } else {
          delete errors.contactEmail;
        }
        break;

      case 'contactPhone':
        if (value.trim()) {
          // Optional phone validation
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
          if (!phoneRegex.test(cleanPhone)) {
            errors.contactPhone = "Please enter a valid phone number";
          } else {
            delete errors.contactPhone;
          }
        } else {
          delete errors.contactPhone;
        }
        break;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Basic required fields validation
    if (!formData.description.trim()) {
      errors.push("Incident description is required");
    } else if (formData.description.trim().length < 10) {
      errors.push("Please provide more details about the incident");
    }

    if (!formData.location.trim()) {
      errors.push("Location is required");
    } else if (formData.location.trim().length < 3) {
      errors.push("Please provide a more specific location");
    }

    if (!selectedOrg) {
      errors.push("Please select an organization");
    }

    // Validation for identified reports
    if (!isAnonymous && user) {
      // For identified reports, validate contact information if chat is enabled
      if (enableChat) {
        if (!formData.contactName.trim()) {
          errors.push("Name is required when chat is enabled");
        } else if (formData.contactName.trim().length < 2) {
          errors.push("Please enter your full name");
        }

        if (!formData.contactEmail.trim()) {
          errors.push("Email is required when chat is enabled");
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.contactEmail.trim())) {
            errors.push("Please enter a valid email address");
          }
        }
      }
    }

    // Validation for anonymous reports
    if (isAnonymous) {
      // Ensure chat is disabled for anonymous reports
      if (enableChat) {
        errors.push("Chat cannot be enabled for anonymous reports");
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(". "),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setIsSubmitting(true);

    try {
      // Check network connectivity before submission
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network and try again.");
      }

      // Prepare report data based on anonymous/identified mode
      const reportData = {
        reporter_id: isAnonymous ? null : user?.id,
        organization_id: selectedOrg,
        is_anonymous: isAnonymous,
        incident_type: formData.incidentType.trim() || null,
        location: formData.location.trim(),
        description: formData.description.trim(),
        contact_name: isAnonymous ? null : (formData.contactName.trim() || null),
        contact_email: isAnonymous ? null : (formData.contactEmail.trim() || null),
        contact_phone: isAnonymous ? null : (formData.contactPhone.trim() || null),
        enable_chat: enableChat && !isAnonymous && !!user, // Ensure chat is only enabled for authenticated, identified reports
      };

      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { 'Authorization': `Bearer ${user.token}` })
        },
        body: JSON.stringify(reportData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please sign in to submit a report.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to submit this report.");
        } else if (response.status === 400) {
          throw new Error(responseData.message || "Invalid report data. Please check your input and try again.");
        } else if (response.status === 409) {
          throw new Error("A similar report already exists. Please check your previous submissions.");
        } else {
          throw new Error(responseData.message || "Failed to submit report. Please try again.");
        }
      }

      const successMessage = isAnonymous
        ? "Anonymous report submitted successfully. You are safe and help is on the way."
        : "Report submitted successfully. You are safe and help is on the way.";

      toast({
        title: "Success",
        description: successMessage,
      });

      // Navigate based on user authentication status and report type
      if (user) {
        navigate('/profile');
      } else {
        navigate('/'); // Redirect unauthenticated users to home
      }
    } catch (error: any) {
      console.error('Report submission error:', error);

      // Enhanced error categorization and user-friendly messages
      let errorTitle = "Submission Error";
      let errorDescription = "Failed to submit report. Please try again.";
      let showRetry = true;

      if (error.message?.includes('network') || error.message?.includes('internet')) {
        errorTitle = "Network Error";
        errorDescription = "Please check your internet connection and try again.";
      } else if (error.message?.includes('timeout')) {
        errorTitle = "Request Timeout";
        errorDescription = "The request took too long. Please try again.";
      } else if (error.message?.includes('permission') || error.message?.includes('unauthorized') || error.message?.includes('security policy')) {
        errorTitle = "Permission Error";
        errorDescription = error.message?.includes('Anonymous reporting')
          ? "Anonymous reporting is temporarily unavailable. Please sign in to submit your report."
          : "You don't have permission to perform this action. Please sign in and try again.";
        showRetry = false;
      } else if (error.message?.includes('organization')) {
        errorTitle = "Organization Error";
        errorDescription = error.message;
        showRetry = false;
      } else if (error.message) {
        errorDescription = error.message;
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
        action: showRetry ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(e)}
          >
            Retry
          </Button>
        ) : error.message?.includes('Anonymous reporting') && !user ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth?returnTo=' + encodeURIComponent(window.location.pathname))}
          >
            Sign In
          </Button>
        ) : undefined,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Report Incident</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Incident Report Form
            </CardTitle>
            <CardDescription>
              Your report helps us provide better support and ensure safety. All information is confidential.
            </CardDescription>

            {/* Form completion indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Form Completion</span>
                <span>
                  {(() => {
                    const requiredFields = ['description', 'location'];
                    if (!isAnonymous && enableChat) {
                      requiredFields.push('contactName', 'contactEmail');
                    }
                    const completedFields = requiredFields.filter(field => {
                      const value = field === 'location' || field === 'description'
                        ? formData[field as keyof typeof formData]
                        : formData[field as keyof typeof formData];
                      return value && value.trim().length > 0 && !fieldErrors[field];
                    });
                    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
                    return `${percentage}%`;
                  })()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(() => {
                      const requiredFields = ['description', 'location'];
                      if (!isAnonymous && enableChat) {
                        requiredFields.push('contactName', 'contactEmail');
                      }
                      const completedFields = requiredFields.filter(field => {
                        const value = field === 'location' || field === 'description'
                          ? formData[field as keyof typeof formData]
                          : formData[field as keyof typeof formData];
                        return value && value.trim().length > 0 && !fieldErrors[field];
                      });
                      return Math.round((completedFields.length / requiredFields.length) * 100);
                    })()}%`
                  }}
                ></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anonymous Reporting Option */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={handleAnonymousToggle}
                    disabled={!user} // Disable toggle for unauthenticated users
                  />
                  <Label
                    htmlFor="anonymous"
                    className={`text-sm font-medium ${user ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  >
                    Submit this report anonymously
                    {!user && " (Required for guests)"}
                  </Label>
                </div>

                {/* Anonymous reporting help text */}
                <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-800">
                        {isAnonymous ? "Anonymous Reporting" : "Identified Reporting"}
                      </p>
                      <p className="text-xs text-blue-700">
                        {isAnonymous ? (
                          "Your identity will not be stored or shared. Chat functionality is disabled for anonymous reports to protect your privacy."
                        ) : (
                          "Your contact information will be stored securely and only shared with the selected organization. You can enable chat for real-time support."
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Guest User:</strong> You are not signed in, so your report will be submitted anonymously.
                      <Link to="/auth" className="text-amber-900 hover:underline ml-1 font-medium">
                        Sign in
                      </Link> to enable identified reporting and chat features.
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      <strong>Note:</strong> If you experience issues with anonymous reporting, signing in may resolve them.
                    </p>
                  </div>
                )}
              </div>

              {/* Organization Selection */}
              <div className="space-y-2">
                <Label htmlFor="organization">
                  Select Organization to Report To *
                </Label>
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} {org.is_default && "(Default)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Reports are sent to the default organization unless you select a different one
                </p>
              </div>

              {/* Incident Type */}
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type (Optional)</Label>
                <Input
                  id="incidentType"
                  placeholder="e.g., Physical Violence, Sexual Harassment, etc."
                  value={formData.incidentType}
                  onChange={(e) => updateFormField('incidentType', e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location of Incident *
                </Label>
                <Input
                  id="location"
                  placeholder="Enter address or location details"
                  value={formData.location}
                  onChange={(e) => updateFormField('location', e.target.value)}
                  required
                  className={fieldErrors.location ? "border-destructive focus:border-destructive" : ""}
                />
                {fieldErrors.location && (
                  <p className="text-sm text-destructive">{fieldErrors.location}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Incident Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please describe what happened in detail..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  required
                  className={`resize-none ${fieldErrors.description ? "border-destructive focus:border-destructive" : ""}`}
                  maxLength={2000}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Include as much detail as you feel comfortable sharing
                  </p>
                  <div className="flex items-center gap-2">
                    {formData.description.length > 1800 && (
                      <span className="text-xs text-muted-foreground">
                        {formData.description.length}/2000
                      </span>
                    )}
                    {formData.description.trim().length >= 10 && !fieldErrors.description && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Valid description"></div>
                    )}
                  </div>
                </div>
                {fieldErrors.description && (
                  <p className="text-sm text-destructive">{fieldErrors.description}</p>
                )}
              </div>

              {/* Enable Chat Option */}
              <div className="space-y-3">
                {!isAnonymous && user && (
                  <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Checkbox
                      id="enableChat"
                      checked={enableChat}
                      onCheckedChange={(checked) => setEnableChat(checked as boolean)}
                    />
                    <Label
                      htmlFor="enableChat"
                      className="text-sm font-medium cursor-pointer flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-primary" />
                      Enable quick chat with the organization
                    </Label>
                  </div>
                )}

                {isAnonymous && (
                  <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg border border-muted">
                    <Checkbox
                      id="enableChatDisabled"
                      checked={false}
                      disabled={true}
                    />
                    <Label
                      htmlFor="enableChatDisabled"
                      className="text-sm font-medium cursor-not-allowed flex items-center gap-2 opacity-60"
                    >
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      Enable quick chat with the organization
                    </Label>
                  </div>
                )}

                {isAnonymous && (
                  <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Chat is not available for anonymous reports.</strong>
                      {user ? (
                        " Uncheck 'Submit anonymously' above to enable chat functionality."
                      ) : (
                        <>
                          {" "}
                          <Link to="/auth" className="text-amber-900 hover:underline font-medium">
                            Sign in
                          </Link>
                          {" "}and submit an identified report to enable chat.
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information (shown only if not anonymous) */}
              {!isAnonymous && (
                <div className="space-y-4 p-4 border border-border rounded-lg">
                  <h3 className="font-medium text-sm text-foreground">Contact Information</h3>
                  <p className="text-xs text-muted-foreground">
                    {enableChat
                      ? "Name and email are required when chat is enabled for follow-up communication."
                      : "Contact information is optional for identified reports."
                    }
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">
                      Your Name {enableChat && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="Full name"
                      value={formData.contactName}
                      onChange={(e) => updateFormField('contactName', e.target.value)}
                      className={fieldErrors.contactName ? "border-destructive focus:border-destructive" : ""}
                    />
                    {fieldErrors.contactName && (
                      <p className="text-sm text-destructive">{fieldErrors.contactName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">
                      Email Address {enableChat && <span className="text-destructive">*</span>}
                    </Label>
                    <div className="relative">
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => updateFormField('contactEmail', e.target.value)}
                        className={fieldErrors.contactEmail ? "border-destructive focus:border-destructive" : ""}
                      />
                      {formData.contactEmail.trim() && !fieldErrors.contactEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" title="Valid email"></div>
                      )}
                    </div>
                    {enableChat && !fieldErrors.contactEmail && (
                      <p className="text-xs text-muted-foreground">
                        Required for chat notifications and follow-up communication
                      </p>
                    )}
                    {fieldErrors.contactEmail && (
                      <p className="text-sm text-destructive">{fieldErrors.contactEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormField('contactPhone', e.target.value)}
                        className={fieldErrors.contactPhone ? "border-destructive focus:border-destructive" : ""}
                      />
                      {formData.contactPhone.trim() && !fieldErrors.contactPhone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" title="Valid phone number"></div>
                      )}
                    </div>
                    {fieldErrors.contactPhone && (
                      <p className="text-sm text-destructive">{fieldErrors.contactPhone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Network Status Indicator */}
              {!isOnline && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-amber-800">
                    <strong>You're offline.</strong> Please check your internet connection before submitting.
                  </p>
                </div>
              )}

              {/* Submit Progress */}
              {isSubmitting && (
                <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-blue-800">Submitting your report...</p>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-blue-700">
                    Please don't close this page. Your report is being processed securely.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 relative"
                  disabled={loading || !isOnline || Object.keys(fieldErrors).length > 0}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : !isOnline ? (
                    'Offline - Cannot Submit'
                  ) : Object.keys(fieldErrors).length > 0 ? (
                    'Please Fix Errors Above'
                  ) : (
                    'Submit Report'
                  )}
                </Button>
                <Button type="button" variant="outline" size="lg" asChild disabled={loading}>
                  <Link to="/">Cancel</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this report, you acknowledge that the information provided will be used to support your case and ensure safety.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReportIncident;
