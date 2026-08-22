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
    // DISABLE CUSTOM CURSOR ON TABLET / MOBILE / TOUCH
    // =====================================================

    const isTouchDevice =
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

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
        "a, button, [role='button']"
      );

      setHovering(Boolean(interactive));
    };

    // =====================================================
    // CLICK
    //
    // Visual effect → everywhere
    // Sound → buttons / links only
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
          // Ignore browser audio restrictions.
        });
      }

      // ---------------------------------------------------
      // CLICK EFFECT
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
      // REMOVE EFFECT
      // ---------------------------------------------------

      setTimeout(() => {
        setClickEffects((current) =>
          current.filter(
            (item) => item.id !== effect.id
          )
        );
      }, 450);
    };

    // =====================================================
    // MOUSE LEAVE
    // =====================================================

    const handleMouseLeave = () => {
      setVisible(false);
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

    document.addEventListener(
      "mouseleave",
      handleMouseLeave
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

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <>
      {/* ===================================================
          GLOBAL CLICK EFFECT
          DESKTOP ONLY
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
          <span />
          <span />
          <span />
          <span />
        </div>
      ))}

      {/* ===================================================
          CUSTOM CURSOR
          DESKTOP ONLY
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
          <div className="grant-cursor-arrow" />
        </div>
      )}
    </>
  );
}