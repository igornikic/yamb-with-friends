import React from "react";
import { useMusic } from "../../contexts/MusicContext";

const musicTracks = [
  { label: "Track 1", src: "/background-music.mp3" },
  { label: "Track 2", src: "/battle-of-the-dragons.mp3" },
];

const BackgroundMusic = () => {
  const {
    isMuted,
    volume,
    currentTrack,
    isPlayed,
    setIsMuted,
    setVolume,
    setCurrentTrack,
    setIsPlayed,
  } = useMusic();

  const handlePlayPause = () => {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlayed(false);
      } else {
        setIsPlayed(true);
        audio.pause();
      }
    }
  };

  const handleReset = () => {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      if (!isMuted) {
        audio.play();
      }
    }
  };

  const handleTrackChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTrack(event.target.value);
  };

  return (
    <div className="background-music">
      <h2>Background Music</h2>
      {/* Soundtrack options */}
      <select onChange={handleTrackChange} value={currentTrack}>
        {musicTracks.map((track) => (
          <option key={track.src} value={track.src}>
            {track.label}
          </option>
        ))}
      </select>
      {/* Reset button */}
      <button onClick={handleReset}>🔄 Reset</button>
      {/* Play/Pause button */}
      <button onClick={handlePlayPause}>{isPlayed ? "Play" : "Pause"}</button>
      {/* Muted button */}
      <button onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? "🔇" : "🔊"}
      </button>
      {/* Volume range input */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        style={{ marginLeft: "10px" }}
      />
    </div>
  );
};

export default BackgroundMusic;
