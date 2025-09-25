import { useState } from "react";
import { Menu, Phone, Mail, MapPin, Globe } from "lucide-react";
import { KoLakeLogo } from "@/components/KoLakeLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface KoLakeNavProps {
  onBookingClick?: () => void;
}

export function KoLakeNav({ onBookingClick }: KoLakeNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Main navigation items
  const mainNavItems = [
    { 
      href: "#rooms", 
      label: "Accommodations",
      description: "Luxury rooms and villas",
      featured: true
    },
    { 
      href: "#gallery", 
      label: "Gallery",
      description: "Photo and video showcase"
    },
    { 
      href: "#amenities", 
      label: "Amenities",
      description: "Resort facilities and services"
    },
    { 
      href: "#location", 
      label: "Location",
      description: "Find us in Kandy, Sri Lanka"
    },
    { 
      href: "#contact", 
      label: "Contact",
      description: "Get in touch with our team"
    },
  ];

  // Experience navigation items
  const experienceItems = [
    { href: "#spa", label: "Spa & Wellness", description: "Rejuvenate your mind and body" },
    { href: "#dining", label: "Dining", description: "Gourmet cuisine and local flavors" },
    { href: "#activities", label: "Activities", description: "Lake adventures and cultural tours" },
    { href: "#events", label: "Events", description: "Weddings and special occasions" },
  ];

  // Additional navigation items
  const additionalItems = [
    { href: "#sustainability", label: "Sustainability", description: "Our eco-friendly practices" },
    { href: "#packages", label: "Packages", description: "Special offers and deals" },
    { href: "#blog", label: "Blog", description: "Travel tips and stories" },
    { href: "#reviews", label: "Reviews", description: "Guest testimonials" },
  ];

  const allNavItems = [...mainNavItems, ...experienceItems, ...additionalItems];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Navigation Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <a href="#top" className="hover:opacity-80 transition-opacity">
            <KoLakeLogo variant="primary" className="h-12" />
          </a>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-2">
              {/* Main Navigation */}
              {mainNavItems.slice(0, 3).map((item) => (
                <NavigationMenuItem key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {item.label}
                  </a>
                </NavigationMenuItem>
              ))}
              
              {/* Experiences Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10">Experiences</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="row-span-3">
                      <h4 className="mb-2 text-sm font-medium text-foreground">Resort Experiences</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Discover unique activities and services that make your stay memorable.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {experienceItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">{item.label}</div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* More Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10">More</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[300px]">
                    {additionalItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium">{item.label}</div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </a>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct Links */}
              {mainNavItems.slice(3).map((item) => (
                <NavigationMenuItem key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {item.label}
                  </a>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Contact Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href="tel:+94771234567">
                  <Phone className="w-4 h-4" />
                  <span className="sr-only">Call us</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href="mailto:info@kolakevilla.com">
                  <Mail className="w-4 h-4" />
                  <span className="sr-only">Email us</span>
                </a>
              </Button>
            </div>

            {/* Book Now Button */}
            <Button
              onClick={onBookingClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              size="sm"
            >
              Book Now
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-center px-6 py-4 border-b border-border">
                    <KoLakeLogo variant="secondary" className="h-8" />
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 px-6 py-6">
                    <div className="space-y-1">
                      <h3 className="mb-3 text-sm font-medium text-foreground">Main Menu</h3>
                      {mainNavItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex flex-col space-y-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                          onClick={handleLinkClick}
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </a>
                      ))}
                      
                      <h3 className="mt-6 mb-3 text-sm font-medium text-foreground">Experiences</h3>
                      {experienceItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex flex-col space-y-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                          onClick={handleLinkClick}
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </a>
                      ))}
                      
                      <h3 className="mt-6 mb-3 text-sm font-medium text-foreground">More</h3>
                      {additionalItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex flex-col space-y-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                          onClick={handleLinkClick}
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </a>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t border-border px-6 py-6 space-y-4">
                    <div className="space-y-3 text-sm">
                      <a 
                        href="tel:+94771234567"
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>+94 77 123 4567</span>
                      </a>
                      <a 
                        href="mailto:info@kolakevilla.com"
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>info@kolakevilla.com</span>
                      </a>
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Kandy Lake, Sri Lanka</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        onBookingClick?.();
                        handleLinkClick();
                      }} 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}