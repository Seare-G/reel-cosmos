import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl: string | null;
  title: string;
}

const TrailerModal = ({ isOpen, onClose, embedUrl, title }: TrailerModalProps) => {
  if (!embedUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 border-0 bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} - Trailer</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background text-foreground"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={`${title} Trailer`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;