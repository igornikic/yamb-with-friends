import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

type MusicContextType = {
  isMuted: boolean;
  volume: number;
  currentTrack: string;
  isPlayed: boolean;
  setIsMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: string) => void;
  setIsPlayed: (played: boolean) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlayed, setIsPlayed] = useState(true);
  const [currentTrack, setCurrentTrack] = useState("/background-music.mp3");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <MusicContext.Provider
      value={{
        isMuted,
        volume,
        currentTrack,
        isPlayed,
        setIsMuted,
        setVolume,
        setCurrentTrack,
        setIsPlayed,
      }}
    >
      {children}
      <audio ref={audioRef} loop />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
