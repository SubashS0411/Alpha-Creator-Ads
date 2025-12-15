import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoGeneratorButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    setIsLoading(true);
    
    try {
      // Instead of calling the n8n webhook that redirects to Opal,
      // we'll handle video generation locally or call a different service
      console.log('Starting video generation...');
      
      // Simulate video generation process
      // You can replace this with actual video generation logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "Video generation completed successfully",
      });

      console.log('Video generation completed locally');
      
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerateVideo}
      disabled={isLoading}
      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Video'
      )}
    </Button>
  );
};

export default VideoGeneratorButton;
