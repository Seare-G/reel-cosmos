import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserProfiles, useCreateProfile, UserProfile } from '@/hooks/useProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilesProps {
  onSelectProfile: (profile: UserProfile) => void;
}

const Profiles = ({ onSelectProfile }: ProfilesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  
  const { user, signOut } = useAuth();
  const { data: profiles = [], isLoading } = useUserProfiles();
  const createProfile = useCreateProfile();
  const { toast } = useToast();

  const handleCreateProfile = async () => {
    if (!profileName.trim()) return;
    
    try {
      const newProfile = await createProfile.mutateAsync({
        name: profileName,
        is_adult: isAdult
      });
      
      toast({
        title: "Profile created!",
        description: `${profileName} profile has been created successfully.`
      });
      
      setProfileName('');
      setIsAdult(false);
      setIsDialogOpen(false);
      onSelectProfile(newProfile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create profile. Please try again."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Who's watching?</h1>
          <Button variant="ghost" onClick={signOut}>
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {profiles.map((profile) => (
            <Card 
              key={profile.id} 
              className="cursor-pointer transition-transform hover:scale-105 bg-card/50 border-border"
              onClick={() => onSelectProfile(profile)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground">{profile.name}</h3>
              </CardContent>
            </Card>
          ))}
          
          {profiles.length < 5 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer transition-transform hover:scale-105 bg-card/30 border-dashed border-2 border-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-lg bg-muted/20 mx-auto mb-4 flex items-center justify-center">
                      <Plus className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-muted-foreground">Add Profile</h3>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Create New Profile</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="profileName" className="block text-sm font-medium mb-2">
                      Profile Name
                    </label>
                    <Input
                      id="profileName"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Enter profile name"
                      className="bg-input border-border"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdult"
                      checked={isAdult}
                      onChange={(e) => setIsAdult(e.target.checked)}
                      className="rounded border-border"
                    />
                    <label htmlFor="isAdult" className="text-sm">
                      Adult content (18+)
                    </label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={handleCreateProfile}
                      disabled={!profileName.trim() || createProfile.isPending}
                      className="flex-1"
                    >
                      {createProfile.isPending ? 'Creating...' : 'Create Profile'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profiles;