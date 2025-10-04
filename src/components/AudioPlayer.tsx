import { useEffect, useRef, useState } from 'react';
import musicFile from '../assets/audio/De_Emeralds_Choir___Gbenga_Obagbemi_-_Gbese__Official_Video_(256k).mp3'; // Adjust path as needed
import './AudioPlayer.css';

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEnablePrompt, setShowEnablePrompt] = useState(false);

  useEffect(() => {
    // Create audio element on mount
    const audio = new Audio(musicFile);
    audio.loop = true;
    // Try unmuted autoplay first (preferred). Browsers may block this.
    audio.muted = false;
    audioRef.current = audio;
    // Helper to try playing with a specific muted value
    const tryPlay = async (muted: boolean) => {
      try {
        audio.muted = muted;
        await audio.play();
        return true;
      } catch (e) {
        return false;
      }
    };

    // Attempt unmuted autoplay first, fall back to muted autoplay, otherwise remain paused
    (async () => {
      const unmutedWorked = await tryPlay(false);
      if (unmutedWorked) {
        setIsPlaying(true);
        setIsMuted(false);
        setShowEnablePrompt(false);
        return;
      }

      const mutedWorked = await tryPlay(true);
      if (mutedWorked) {
        setIsPlaying(true);
        setIsMuted(true);
        // We played but muted — prompt user to enable sound after a short delay so css can load
        setTimeout(() => setShowEnablePrompt(true), 200);
        return;
      }

      // Both attempts failed; leave controls for user
      setIsPlaying(false);
      setTimeout(() => setShowEnablePrompt(true), 200);
    })();

    // Keep component state in sync with audio events
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => setIsMuted(!!audio.muted);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('volumechange', onVolumeChange);

    return () => {
      // Cleanup: remove listeners, pause and remove src
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('volumechange', onVolumeChange);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        // play succeeded; state will also be updated by event listener
      } catch (err) {
        // Try playing muted as a fallback when direct play fails
        console.warn('Playback failed, attempting muted fallback:', err);
        try {
          audio.muted = true;
          await audio.play();
          // muted playback succeeded
          setIsMuted(true);
          setIsPlaying(true);
        } catch (err2) {
          console.warn('Muted fallback also failed:', err2);
        }
      }
    }
  };

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const willBeMuted = !audio.muted;
    audio.muted = willBeMuted;
    // setIsMuted will be handled by the volumechange listener, but keep immediate update
    setIsMuted(willBeMuted);

    // If unmuting and the audio isn't playing, try to play with sound.
    if (!willBeMuted && !isPlaying) {
      try {
        await audio.play();
        // play event will update state
      } catch (err) {
        console.warn('Unable to play after unmute:', err);
        // If unmuted play fails, re-mute to avoid sudden silent failures
        audio.muted = true;
        setIsMuted(true);
      }
    }
  };

  return (
    <>
      <div className="audio-player">
        <button onClick={togglePlay} aria-pressed={isPlaying}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className={isMuted ? 'unmute' : 'mute'} onClick={toggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      {showEnablePrompt && (
        <div className="audio-consent-overlay" role="dialog" aria-modal="true">
          <div className="audio-consent-box">
            <h3>Enable site audio</h3>
            <p>Click the button below to enable sound for this site.</p>
            <div className="audio-consent-actions">
              <button onClick={async () => {
                const audio = audioRef.current;
                if (!audio) return;
                try {
                  audio.muted = false;
                  await audio.play();
                  setShowEnablePrompt(false);
                } catch (err) {
                  console.warn('Failed to enable audio:', err);
                }
              }} className="unmute">Enable audio</button>
              <button onClick={() => { setShowEnablePrompt(false); }} className="dismiss">Continue without sound</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioPlayer;