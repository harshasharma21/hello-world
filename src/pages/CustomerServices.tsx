import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Department {
  id: string;
  name: string;
}

interface SalesRep {
  id: string;
  name: string;
}

const CustomerServices: React.FC = () => {
  const [shopName, setShopName] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [email, setEmail] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [skus, setSkus] = useState("");
  const [salesRepId, setSalesRepId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    const [deptResult, repResult] = await Promise.all([
      supabase.from('departments').select('id, name').eq('is_active', true).order('sort_order'),
      supabase.from('sales_representatives').select('id, name').eq('is_active', true).order('sort_order')
    ]);

    if (deptResult.data) setDepartments(deptResult.data);
    if (repResult.data) setSalesReps(repResult.data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedRep = salesReps.find(r => r.id === salesRepId);

      const { error } = await supabase.from('customer_service_requests').insert({
        shop_name: shopName,
        account_code: accountCode,
        email: email || null,
        invoice_date: invoiceDate || null,
        credit_reason: creditReason,
        additional_info: additionalInfo || null,
        skus,
        sales_rep_id: salesRepId || null,
        sales_rep_name: selectedRep?.name || null,
      });

      if (error) throw error;

      toast.success("Your request has been submitted. We'll get back to you soon!");
      // Reset form
      setShopName("");
      setAccountCode("");
      setEmail("");
      setInvoiceDate("");
      setCreditReason("");
      setAdditionalInfo("");
      setSkus("");
      setSalesRepId("");
      setDepartmentId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
          <div className="w-full max-w-2xl">
            <Card className="shadow-sm">
              <CardContent className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Sales Requests
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="shopName" className="text-sm font-medium">
                      Customer Shop Name <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="shopName" 
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Your shop name"
                      required
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{shopName.length}/255</p>
                  </div>

                  <div>
                    <Label htmlFor="accountCode" className="text-sm font-medium">
                      Customer Account Code <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="accountCode" 
                      value={accountCode}
                      onChange={(e) => setAccountCode(e.target.value)}
                      placeholder="Your account code"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Customer Email Address
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      If you would like to receive updates via email
                    </p>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department
                    </Label>
                    <Select value={departmentId} onValueChange={setDepartmentId}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="invoiceDate" className="text-sm font-medium">
                      Invoice Date
                    </Label>
                    <Input 
                      id="invoiceDate" 
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="creditReason" className="text-sm font-medium">
                      Credit Reason <span className="text-destructive">*</span>
                    </Label>
                    <Select value={creditReason} onValueChange={setCreditReason} required>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missing-delivery">Missing on Delivery</SelectItem>
                        <SelectItem value="mispick">Mispick</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="short-dated">Short Dated</SelectItem>
                        <SelectItem value="quality-issue">Quality Issue</SelectItem>
                        <SelectItem value="pricing-error">Pricing Error</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo" className="text-sm font-medium">
                      Additional Info
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      SKU of mispick or missing on delivery if you don't want to upload a picture.
                    </p>
                    <Textarea 
                      id="additionalInfo" 
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Additional details..."
                      className="mt-1.5 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skus" className="text-sm font-medium">
                      SKUS <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Found on left hand side of invoice next to product name
                    </p>
                    <Input 
                      id="skus" 
                      value={skus}
                      onChange={(e) => setSkus(e.target.value)}
                      placeholder="Enter SKU(s)"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="picture" className="text-sm font-medium">
                      Picture
                    </Label>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      If missing please take picture of line on invoice
                    </p>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Need a clear picture of barcode and product as well as damage / mould
                    </p>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Input 
                        id="picture" 
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                      <label htmlFor="picture" className="cursor-pointer">
                        <p className="text-sm text-muted-foreground">
                          Choose a file to upload or drag and drop here
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="salesRep" className="text-sm font-medium">
                      Your direct sales representative
                    </Label>
                    <Select value={salesRepId} onValueChange={setSalesRepId}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select your sales rep" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesReps.map((rep) => (
                          <SelectItem key={rep.id} value={rep.id}>
                            {rep.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerServices;