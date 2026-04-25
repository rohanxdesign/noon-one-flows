import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { getSvgPath } from "figma-squircle";

/**
 * iOS/Figma-style corner smoothing wrapper.
 *
 * CSS `border-radius` cuts corners with circular arcs, which produces a
 * visible "kink" where the arc meets the straight edge. Figma (and iOS)
 * instead use a superellipse (squircle) so the curvature is continuous —
 * smoother to the eye, especially at larger radii.
 *
 * This component measures itself with `ResizeObserver`, asks
 * `figma-squircle` for the matching SVG path, and applies it as a
 * `clip-path`. Pass the same number you'd use for `rounded-[N]`.
 *
 * Smoothing defaults to `0.6` (60%) — Figma's "iOS" preset.
 */

export interface SmoothCornersProps {
  radius: number;
  smoothing?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  as?: ElementType;
  /** Forwarded to the underlying element for click handlers etc. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  onScroll?: React.UIEventHandler<HTMLElement>;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

const SmoothCorners = forwardRef<HTMLElement, SmoothCornersProps>(
  function SmoothCorners(
    {
      radius,
      smoothing = 0.6,
      className,
      style,
      children,
      as: Tag = "div",
      onClick,
      onScroll,
      ariaLabel,
      type,
    },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLElement | null>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLElement);

    const [clipPath, setClipPath] = useState<string | undefined>(undefined);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const update = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        const path = getSvgPath({
          width,
          height,
          cornerRadius: radius,
          cornerSmoothing: smoothing,
          preserveSmoothing: true,
        });
        setClipPath(`path("${path}")`);
      };

      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, [radius, smoothing]);

    return (
      <Tag
        ref={innerRef}
        className={className}
        style={{ ...style, clipPath, WebkitClipPath: clipPath }}
        onClick={onClick}
        onScroll={onScroll}
        aria-label={ariaLabel}
        type={Tag === "button" ? type ?? "button" : undefined}
      >
        {children}
      </Tag>
    );
  },
);

export default SmoothCorners;
