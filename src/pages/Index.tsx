import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { categories } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-trust-blue text-primary-foreground">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Trusted B2B Food Supplier
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
                Quality wholesale food products delivered direct to your business. Competitive pricing, reliable service, extensive range.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/shop">
                    Browse Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/fast-order">Fast Order</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-neutral-50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">Certified suppliers</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Next-day available</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Competitive Prices</h3>
                <p className="text-sm text-muted-foreground">Best wholesale rates</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our extensive range of quality food products across multiple categories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(cat => !cat.parentId).map((category) => (
                <Link
                  key={category.id}
                  to={`/shop/category/${category.slug}-${category.id}`}
                >
                  <Card className="group overflow-hidden hover:shadow-elegant-hover transition-smooth cursor-pointer h-full">
                    <div className="aspect-[16/10] bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-smooth">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.productCount} products
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-accent to-sage-green text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Order in Bulk?
            </h2>
            <p className="text-xl mb-8 text-accent-foreground/90 max-w-2xl mx-auto">
              Use our Fast Order system to quickly add multiple items to your cart using SKUs or CSV upload
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/fast-order">
                Try Fast Order
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
