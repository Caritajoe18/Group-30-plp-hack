import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Phone, MapPin, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const supportServices = [
  {
    id: 1,
    name: "Community Counseling Center",
    category: "Counseling",
    description: "Professional counseling and therapy services for survivors of violence",
    phone: "+1 (555) 123-4567",
    email: "info@counseling-center.org",
    address: "123 Main Street, Suite 200",
    hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
  },
  {
    id: 2,
    name: "Legal Aid Society",
    category: "Legal Aid",
    description: "Free legal consultation and representation for victims",
    phone: "+1 (555) 234-5678",
    email: "help@legalaid.org",
    address: "456 Justice Avenue",
    hours: "Mon-Fri: 8AM-5PM",
  },
  {
    id: 3,
    name: "SafeHaven Medical Clinic",
    category: "Medical",
    description: "Confidential medical care and support services",
    phone: "+1 (555) 345-6789",
    email: "care@safehaven.org",
    address: "789 Health Drive",
    hours: "24/7 Emergency Services",
  },
  {
    id: 4,
    name: "Women's Empowerment Network",
    category: "Support Groups",
    description: "Peer support groups and empowerment workshops",
    phone: "+1 (555) 456-7890",
    email: "connect@womenempowerment.org",
    address: "321 Community Lane",
    hours: "Tue-Thu: 6PM-8PM, Sat: 2PM-5PM",
  },
  {
    id: 5,
    name: "Emergency Shelter Services",
    category: "Housing",
    description: "Safe temporary housing and accommodation",
    phone: "+1 (555) 567-8901",
    email: "shelter@safespace.org",
    address: "Confidential Location",
    hours: "24/7 Availability",
  },
  {
    id: 6,
    name: "Children's Support Center",
    category: "Child Services",
    description: "Specialized support for children affected by family violence",
    phone: "+1 (555) 678-9012",
    email: "kids@supportcenter.org",
    address: "654 Care Boulevard",
    hours: "Mon-Fri: 9AM-5PM",
  },
];

const SupportServices = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = supportServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Support Services</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Find Support Services</CardTitle>
              <CardDescription>
                Search for counseling, legal aid, medical assistance, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, category, or service type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Categories Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {["Counseling", "Legal Aid", "Medical", "Support Groups", "Housing", "Child Services"].map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className="p-3 text-sm font-medium border border-border rounded-lg hover:bg-muted/50 transition-colors text-center"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : "All Support Services"}
              <span className="text-muted-foreground ml-2">({filteredServices.length})</span>
            </h2>

            <div className="grid gap-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            {service.category}
                          </span>
                        </div>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{service.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground truncate">{service.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{service.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{service.hours}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="default" size="sm">
                          <Phone className="w-4 h-4" />
                          Call Now
                        </Button>
                        <Button variant="outline" size="sm">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No services found matching your search.</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportServices;
