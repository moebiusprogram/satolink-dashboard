import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Confetti = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Reproducir sonido
    const audio = new Audio("/sounds/cash.mp3");
    audio.volume = 0.2;
    audio.preload = "auto";
    audio.loop = false;
    audio.play();

    const confettiElements = containerRef.current.querySelectorAll(".confetti");
    confettiElements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: -100, opacity: 0 },
        {
          y: window.innerHeight,
          opacity: 1,
          duration: Math.random() * 2 + 1,
          ease: "bounce.out",
          repeat: 0,
        }
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="confetti-container"
      style={{ position: "relative", zIndex: 999 }}>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            width: "10px",
            height: "10px",
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
