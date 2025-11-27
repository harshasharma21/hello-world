import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

const NewCustomerSignup = () => {
  const [formData, setFormData] = useState({
    contactName: "",
    jobTitle: "",
    tradingName: "",
    businessType: "",
    vatNumber: "",
    email: "",
    password: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: "",
    country: "",
    orderingMethod: "",
    paymentMethod: "",
    hearAboutUs: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted! We'll contact you shortly.");
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground mb-8 max-w-4xl mx-auto">
          No two customers are the same. Unlike other distributors, we do not believe in a 'one size fits all' model. 
          That is why we utilise the latest technologies to provide a tailored service for our customer base. Here is what we offer:
        </p>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-primary mb-2">CN Foods</div>
                <h1 className="text-2xl font-semibold">New Customer Signup</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="contactName">
                    Contact Name <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Who is our point of contact at your business?</p>
                  <Input
                    id="contactName"
                    required
                    maxLength={255}
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.contactName.length}/255</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="jobTitle">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">EG Buyer, Director, Manager</p>
                  <Input
                    id="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tradingName">
                    Trading Name <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">EG The name of your shop front</p>
                  <Input
                    id="tradingName"
                    required
                    value={formData.tradingName}
                    onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="businessType">
                    Business Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="cafe">Café</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="caterer">Caterer</SelectItem>
                      <SelectItem value="convenience-store">Convenience Store</SelectItem>
                      <SelectItem value="deli">Deli</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vatNumber">VAT Registration #</Label>
                  <p className="text-xs text-muted-foreground">If registered</p>
                  <Input
                    id="vatNumber"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    placeholder="GB123456789"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">
                    Your Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">Create a password for your account</p>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="mobile">
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 border rounded-md bg-muted/50 text-sm">
                      <span>🇬🇧</span>
                      <span>(+44)</span>
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      required
                      className="flex-1"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="addressLine1">
                    Address Line 1 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="county">County / State</Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="postcode">
                      Post Code / Zip Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="postcode"
                      required
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ireland">Ireland</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="orderingMethod">
                    Ordering Method <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">How are you planning on taking orders?</p>
                  <Select value={formData.orderingMethod} onValueChange={(value) => setFormData({ ...formData, orderingMethod: value })}>
                    <SelectTrigger id="orderingMethod">
                      <SelectValue placeholder="Select ordering method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Portal</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sales-rep">Sales Representative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="paymentMethod">
                    How Do You Pay? <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit-account">Credit Account</SelectItem>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
                  <Select value={formData.hearAboutUs} onValueChange={(value) => setFormData({ ...formData, hearAboutUs: value })}>
                    <SelectTrigger id="hearAboutUs">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="trade-show">Trade Show</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Sign Me Up!
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewCustomerSignup;
