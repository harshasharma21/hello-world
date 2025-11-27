import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message. We'll get back to you as soon as possible!");
    setName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary/90 to-primary py-12 md:py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200')" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Contact us</h1>
        </div>
      </div>
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Intro Text */}
          <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="lg:w-1/2">
              <p className="text-muted-foreground">
                Contact us about anything related to our company or services.
              </p>
              <p className="text-muted-foreground mt-1">
                We'll do our best to get back to you as soon as possible.
              </p>
            </div>
            
            {/* Company Info */}
            <div className="lg:w-1/2 lg:text-right">
              <h3 className="font-semibold text-foreground mb-2">CN Foods Distributors Limited</h3>
              <div className="flex items-center lg:justify-end gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">63-64 Garman Rd, London, N17 0UN, UK</span>
              </div>
              <div className="flex items-center lg:justify-end gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+442084328328" className="text-sm text-primary hover:underline">
                  +44 (0) 20 8432 8328
                </a>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="shadow-sm">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name (First & Last)
                    </Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{name.length}/255</p>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Your Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Your Telephone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex mt-1.5">
                      <div className="flex items-center gap-2 px-3 border border-r-0 border-input rounded-l-md bg-muted/50">
                        <span className="text-sm">🇬🇧</span>
                        <span className="text-sm text-muted-foreground">(+44)</span>
                      </div>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="7123 456789"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      For New supplier queries please apply here and we will get back to you:{" "}
                      <Link to="/new-supplier-signup" className="text-primary hover:underline">
                        https://www.cnfoods.co.uk/new-supplier-signup
                      </Link>
                    </p>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="accounts">Accounts</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="general">General Enquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      How Can We Help? <span className="text-destructive">*</span>
                    </Label>
                    <Textarea 
                      id="message" 
                      required 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide details about your enquiry..."
                      className="min-h-[150px] mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{message.length}/2000</p>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="h-[400px] lg:h-auto min-h-[400px] rounded-lg overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.8547697280437!2d-0.05686952358398438!3d51.59728897182889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ed4c07e5c9b%3A0x7e8b63f9b7c4c6f0!2s63%20Garman%20Rd%2C%20London%20N17%200UN%2C%20UK!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CN Foods Location"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
