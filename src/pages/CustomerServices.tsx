import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, CreditCard, Truck, RefreshCw, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CustomerServices = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Customer Services</h1>
            <p className="text-muted-foreground">
              Everything you need to know about ordering, delivery, returns and more
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <Card className="hover:shadow-lg transition-smooth cursor-pointer">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Orders</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-smooth cursor-pointer">
              <CardContent className="p-4 text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Delivery</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-smooth cursor-pointer">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Payment</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-smooth cursor-pointer">
              <CardContent className="p-4 text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Returns</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-smooth cursor-pointer">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Quality</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-smooth cursor-pointer">
              <CardContent className="p-4 text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">FAQ</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I place an order?</AccordionTrigger>
                  <AccordionContent>
                    You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. 
                    For bulk orders, use our Fast Order feature to quickly add multiple items using SKU codes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What are your delivery times?</AccordionTrigger>
                  <AccordionContent>
                    We offer next-day delivery for orders placed before 2 PM. Standard delivery takes 2-3 business days. 
                    Delivery times may vary depending on your location and product availability.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept all major credit and debit cards, as well as bank transfers for trade accounts. 
                    Payment is processed securely through our encrypted payment gateway.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What is your returns policy?</AccordionTrigger>
                  <AccordionContent>
                    We accept returns within 14 days of delivery for unopened products in their original packaging. 
                    For damaged or incorrect items, please contact us within 48 hours of delivery. 
                    Some perishable items may not be eligible for return.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Do you have minimum order quantities?</AccordionTrigger>
                  <AccordionContent>
                    For retail customers, there is no minimum order. Trade accounts may have minimum order values 
                    to qualify for wholesale pricing and free delivery. Contact our sales team for more information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How can I track my order?</AccordionTrigger>
                  <AccordionContent>
                    Once your order is dispatched, you'll receive a tracking number via email. 
                    You can use this to track your delivery online. Log into your account to view all your order history and tracking information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Do you offer bulk discounts?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer competitive wholesale pricing for bulk orders and trade accounts. 
                    Register for a trade account or contact our sales team to discuss volume discounts for your business.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>What if an item is out of stock?</AccordionTrigger>
                  <AccordionContent>
                    Out of stock items are clearly marked on our website. You can request a notification when the item 
                    is back in stock, or contact our customer service team who may be able to suggest alternatives or 
                    provide an estimated restock date.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 p-6 bg-muted rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Our customer service team is here to help
                </p>
                <Button asChild>
                  <Link to="/contact-us">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerServices;
