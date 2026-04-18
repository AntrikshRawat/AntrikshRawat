import React, { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  // Start as false. We will update to true if the browser allows autoplay.
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          audioRef.current.volume = 0.22;
        })
        .catch((error) => {
          console.warn("Autoplay prevented by browser:", error);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          audioRef.current.volume = 0.22;
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
        });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
      }}
    >
      {/* Removed the HTML autoPlay attribute since useEffect handles it */}
      <audio ref={audioRef} loop>
        <source src="/backgroundMusic2.m4a" type="audio/mp4" />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={togglePlay}
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          color: "var(--text-primary)",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title={isPlaying ? "Pause Music" : "Play Music"}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: "2px" }}
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
