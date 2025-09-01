import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-primary">CINEMIX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">TV Shows</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Movies</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">New & Popular</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">My List</a>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search titles, people, genres" 
              className="pl-10 w-64 bg-secondary border-0 focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;