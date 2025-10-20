import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KoLakeLogo } from "@/components/KoLakeLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Phone, Mail, MapPin, ChevronDown, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onBookingClick?: () => void;
}

export const Navigation = ({ onBookingClick }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { 
      name: "Home", 
      href: "/",
      description: "Return to homepage"
    },
    { 
      name: "Accommodation", 
      href: "/accommodation",
      description: "Luxury rooms and villas"
    },
    { 
      name: "Gallery", 
      href: "/gallery",
      description: "Photo and video gallery"
    },
    { 
      name: "Experiences", 
      href: "/experiences",
      description: "Activities and amenities"
    },
    { 
      name: "Deals", 
      href: "/deals",
      description: "Special offers and packages"
    },
    { 
      name: "Contact", 
      href: "/contact",
      description: "Get in touch with us"
    },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* First Row - Logo and Contact Info */}
        <div className="flex items-center justify-between h-12 border-b border-border/50">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <KoLakeLogo variant="primary" className="h-10" />
          </Link>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-muted-foreground">
            <a 
              href="tel:+94711730345" 
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>+94711730345</span>
            </a>
            <a 
              href="mailto:contact@KoLakeHouse.com"
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span>contact@KoLakeHouse.com</span>
            </a>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Menu className="h-6 w-6" />
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
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={handleNavClick}
                        className={cn(
                          "flex flex-col space-y-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground",
                          location.pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="border-t border-border px-6 py-6 space-y-4">
                  <div className="space-y-3 text-sm">
                    <a 
                      href="tel:+94711730345"
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>+94711730345</span>
                    </a>
                    <a 
                      href="mailto:contact@KoLakeHouse.com"
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>contact@KoLakeHouse.com</span>
                    </a>
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Ahangama, Sri Lanka</span>
                    </div>
                  </div>
                  
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          handleSignOut();
                          handleNavClick();
                        }}
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                      <Button 
                        onClick={() => {
                          window.open("https://www.guesty.com/ko-lake-villa", "_blank");
                          handleNavClick();
                        }} 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      >
                        Book Now
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        asChild 
                        className="w-full"
                        onClick={handleNavClick}
                      >
                        <Link to="/auth">Staff Login</Link>
                      </Button>
                      <Button 
                        onClick={() => {
                          onBookingClick?.();
                          handleNavClick();
                        }} 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      >
                        Book Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Second Row - Navigation and Actions */}
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "hover:bg-accent hover:text-accent-foreground transition-colors",
                      location.pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg z-50">
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  onClick={() => window.open("https://www.guesty.com/ko-lake-villa", "_blank")} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  Book Now
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Staff Login</Link>
                </Button>
                <Button 
                  onClick={() => window.open("https://www.guesty.com/ko-lake-villa", "_blank")} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                >
                  Book Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};