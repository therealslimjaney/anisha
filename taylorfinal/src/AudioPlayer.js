import React, { useEffect, forwardRef } from 'react';

const AudioPlayer = forwardRef((props, ref) => {
  useEffect(() => {
    // Start playing the audio when the component mounts
    ref.current.play().catch(error => {
      // Handle play error if needed
      console.error('Error playing audio:', error);
    });
  }, [ref]);

  return (
    <audio ref={ref} style={{ display: 'none' }}>
      <source src="your-audio-file.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  );
});

export default AudioPlayer;