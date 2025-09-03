import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/hooks/useProfiles';

interface HeaderProps {
  profile?: UserProfile;
  onProfileChange?: () => void;
}

const Header = ({ profile, onProfileChange }: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-primary">CINEMIX</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/my-list" className="text-muted-foreground hover:text-primary transition-colors">My List</Link>
            <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">Browse</Link>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-card/50 border-border focus:border-primary"
            />
          </form>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {profile && (
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium">{profile.name}</p>
                </div>
              )}
              <DropdownMenuItem onClick={onProfileChange} className="cursor-pointer">
                Switch Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;