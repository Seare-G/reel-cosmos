import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">CINEMIX</h1>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
            className="bg-background/20 backdrop-blur border-primary/30 hover:bg-primary/20"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1489599004794-2faca83b4127?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Unlimited movies, TV shows, and more
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Watch anywhere. Cancel anytime. Ready to watch? Enter your email to create or restart your membership.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto text-lg px-8 py-4 bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Enjoy on your TV</h3>
              <p className="text-muted-foreground">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Download your shows</h3>
              <p className="text-muted-foreground">
                Save your favorites easily and always have something to watch.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Watch everywhere</h3>
              <p className="text-muted-foreground">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CINEMIX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;