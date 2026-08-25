"use client";

import { useEffect, useState } from "react";

type ClickEffect = {
  id: number;
  x: number;
  y: number;
};

export default function CustomCursor() {
  const [position, setPosition] = useState({
    x: -100,
    y: -100,
  });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const [clickEffects, setClickEffects] = useState<
    ClickEffect[]
  >([]);

  useEffect(() => {
    // =====================================================
    // DISABLE CUSTOM CURSOR ON TOUCH DEVICES
    // =====================================================

    const isTouchDevice = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;

    if (isTouchDevice) {
      return;
    }

    // =====================================================
    // PRELOAD CLICK SOUND
    // =====================================================

    const clickAudio = new Audio("/click.mp3");

    clickAudio.preload = "auto";
    clickAudio.volume = 0.25;

    // =====================================================
    // CURSOR MOVEMENT
    // =====================================================

    const moveCursor = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setVisible(true);
    };

    // =====================================================
    // HOVER DETECTION
    // =====================================================

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select"
      );

      setHovering(Boolean(interactive));
    };

    // =====================================================
    // CLICK
    // =====================================================

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const interactive = target.closest(
        "a, button, [role='button']"
      );

      // ---------------------------------------------------
      // CLICK SOUND
      // ---------------------------------------------------

      if (interactive) {
        clickAudio.currentTime = 0;

        clickAudio.play().catch(() => {
          // Browser audio restrictions are ignored.
        });
      }

      // ---------------------------------------------------
      // CREATE CLICK EFFECT
      // ---------------------------------------------------

      const effect: ClickEffect = {
        id: Date.now() + Math.random(),
        x: event.clientX,
        y: event.clientY,
      };

      setClickEffects((current) => [
        ...current,
        effect,
      ]);

      // ---------------------------------------------------
      // REMOVE CLICK EFFECT
      // ---------------------------------------------------

      window.setTimeout(() => {
        setClickEffects((current) =>
          current.filter(
            (item) => item.id !== effect.id
          )
        );
      }, 650);
    };

    // =====================================================
    // MOUSE LEAVE
    // =====================================================

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    // =====================================================
    // EVENT LISTENERS
    // =====================================================

    window.addEventListener(
      "mousemove",
      moveCursor
    );

    window.addEventListener(
      "mouseover",
      handleMouseOver
    );

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    document.documentElement.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    document.documentElement.addEventListener(
      "mouseenter",
      handleMouseEnter
    );

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      window.removeEventListener(
        "mousemove",
        moveCursor
      );

      window.removeEventListener(
        "mouseover",
        handleMouseOver
      );

      document.removeEventListener(
        "click",
        handleClick,
        true
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
    };
  }, []);

  return (
    <>
      {/* ===================================================
          CLICK BURSTS
          =================================================== */}

      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="grant-click-burst"
          style={{
            left: effect.x,
            top: effect.y,
          }}
        >
          {/* Main ripple */}
          <span className="grant-click-ring" />

          {/* Secondary ripple */}
          <span className="grant-click-ring grant-click-ring-delay" />

          {/* Four particles */}
          <span className="grant-click-particle particle-1" />
          <span className="grant-click-particle particle-2" />
          <span className="grant-click-particle particle-3" />
          <span className="grant-click-particle particle-4" />

          {/* Center flash */}
          <span className="grant-click-core" />
        </div>
      ))}

      {/* ===================================================
          CUSTOM CYAN CURSOR
          =================================================== */}

      {visible && (
        <div
          className={`grant-cursor ${
            hovering
              ? "grant-cursor-hover"
              : ""
          }`}
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {/* Outer glow */}
          <div className="grant-cursor-glow" />

          {/* Traditional arrow */}
          <svg
            className="grant-cursor-arrow"
            width="28"
            height="34"
            viewBox="0 0 28 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.2 1.8L24.9 15.9C26.2 16.7 25.9 18.6 24.5 19L17.2 21.1L22.4 30.2C23 31.3 22.6 32.7 21.5 33.3L19.1 34.6C18 35.2 16.6 34.8 16 33.7L10.8 24.5L5.5 29.8C4.5 30.8 2.7 30.1 2.6 28.7L0.3 4C0.2 2.2 0.8 1 2.2 1.8Z"
              fill="#00D9FF"
              stroke="#E6FBFF"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>

          {/* Inner cyan highlight */}
          <div className="grant-cursor-core-glow" />
        </div>
      )}
    </>
  );
}