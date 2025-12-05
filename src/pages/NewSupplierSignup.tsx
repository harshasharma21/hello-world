import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import natureliaLogo from "@/assets/naturelia-logo.jpg";

const NewSupplierSignup = () => {
  const [formData, setFormData] = useState({
    brandName: "",
    yourName: "",
    email: "",
    password: "",
    phone: "",
    businessAddress: "",
    website: "",
    commercialsFile: null as File | null,
    brandDeckFile: null as File | null,
    salesDataFile: null as File | null,
    stockistsInLondon: "",
    samplesSent: "",
    teamInfo: "",
    routesToMarket: "",
    marketingPlans: "",
    fieldSalesTeam: "",
    tradeMarketingInvestment: "",
  });

  const commercialsRef = useRef<HTMLInputElement>(null);
  const brandDeckRef = useRef<HTMLInputElement>(null);
  const salesDataRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted! We'll review and contact you shortly.");
    console.log("Supplier form submitted:", formData);
  };

  const FileUploadField = ({ 
    label, 
    description, 
    required, 
    inputRef, 
    file, 
    accept,
    onFileChange 
  }: { 
    label: string; 
    description: string; 
    required?: boolean; 
    inputRef: React.RefObject<HTMLInputElement>;
    file: File | null;
    accept?: string;
    onFileChange: (file: File | null) => void;
  }) => (
    <div className="space-y-1">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {file ? file.name : "Choose a file to upload or drag and drop here"}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <img src={natureliaLogo} alt="Naturelia" className="h-16 mx-auto mb-2" />
                <h1 className="text-2xl font-semibold">New Brand Submissions</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="brandName">
                    Brand Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="brandName"
                    required
                    maxLength={255}
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.brandName.length}/255</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="yourName">
                    Your Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="yourName"
                    required
                    value={formData.yourName}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
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
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 border rounded-md bg-muted/50 text-sm">
                      <span>🇬🇧</span>
                      <span>(+44)</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      className="flex-1"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="businessAddress">
                    Business Address <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.businessAddress} onValueChange={(value) => setFormData({ ...formData, businessAddress: value })}>
                    <SelectTrigger id="businessAddress">
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="manchester">Manchester</SelectItem>
                      <SelectItem value="birmingham">Birmingham</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="website">
                    Website <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    required
                    placeholder="https://www.yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <FileUploadField
                  label="Commercials (Excel Please)"
                  description="Products, Prices, MOQ, Min Shelf Life, Lead Time"
                  required
                  inputRef={commercialsRef}
                  file={formData.commercialsFile}
                  accept=".xlsx,.xls,.csv"
                  onFileChange={(file) => setFormData({ ...formData, commercialsFile: file })}
                />

                <FileUploadField
                  label="Brand Deck"
                  description="PDF explaining your brand"
                  required
                  inputRef={brandDeckRef}
                  file={formData.brandDeckFile}
                  accept=".pdf"
                  onFileChange={(file) => setFormData({ ...formData, brandDeckFile: file })}
                />

                <div className="space-y-1">
                  <Label htmlFor="stockistsInLondon">
                    Do you have stockists in London? <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.stockistsInLondon} onValueChange={(value) => setFormData({ ...formData, stockistsInLondon: value })}>
                    <SelectTrigger id="stockistsInLondon">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FileUploadField
                  label="Sales Data"
                  description="We want to see the when, what, where, quantity, repeat orders. London indie data & direct stockist data is best"
                  required
                  inputRef={salesDataRef}
                  file={formData.salesDataFile}
                  accept=".xlsx,.xls,.csv,.pdf"
                  onFileChange={(file) => setFormData({ ...formData, salesDataFile: file })}
                />

                <div className="space-y-1">
                  <Label htmlFor="samplesSent">
                    Have you sent us samples? <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">FAO Buying Team, Naturelia, London, UK</p>
                  <Select value={formData.samplesSent} onValueChange={(value) => setFormData({ ...formData, samplesSent: value })}>
                    <SelectTrigger id="samplesSent">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="will-send">Will send</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="teamInfo">Brief info on the Team</Label>
                  <Textarea
                    id="teamInfo"
                    maxLength={2000}
                    rows={4}
                    value={formData.teamInfo}
                    onChange={(e) => setFormData({ ...formData, teamInfo: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.teamInfo.length} out of 2000</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="routesToMarket">
                    Current Routes To Market <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">How do you currently serve your customers and what kind of businesses are they?</p>
                  <Textarea
                    id="routesToMarket"
                    required
                    maxLength={2000}
                    rows={4}
                    value={formData.routesToMarket}
                    onChange={(e) => setFormData({ ...formData, routesToMarket: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.routesToMarket.length} out of 2000</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="marketingPlans">
                    What do you have planned for above the line marketing? <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="marketingPlans"
                    required
                    maxLength={2000}
                    rows={4}
                    value={formData.marketingPlans}
                    onChange={(e) => setFormData({ ...formData, marketingPlans: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">{formData.marketingPlans.length} out of 2000</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="fieldSalesTeam">
                    Do you currently have a field sales team? <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.fieldSalesTeam} onValueChange={(value) => setFormData({ ...formData, fieldSalesTeam: value })}>
                    <SelectTrigger id="fieldSalesTeam">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="planning">Planning to build one</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tradeMarketingInvestment">
                    Proposed Trade Marketing & Sales Team Investment <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.tradeMarketingInvestment} onValueChange={(value) => setFormData({ ...formData, tradeMarketingInvestment: value })}>
                    <SelectTrigger id="tradeMarketingInvestment">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under £10,000</SelectItem>
                      <SelectItem value="10k-50k">£10,000 - £50,000</SelectItem>
                      <SelectItem value="50k-100k">£50,000 - £100,000</SelectItem>
                      <SelectItem value="over-100k">Over £100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit
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

export default NewSupplierSignup;