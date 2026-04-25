import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import splashUrl from "../assets/lottie/splash.lottie?url";

/**
 * Plays the noon One splash Lottie once, fires `onDone` when the animation
 * completes (or after a hard 4s timeout — whichever comes first, so we never
 * trap the user if the file fails to emit a `complete` event).
 *
 * Sized to the same 375×812 iPhone frame as the SubscribedUser screen and
 * wrapped in the same `bg-[#f4f4f4]` so the handoff is visually seamless.
 */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="bg-[#f4f4f4] relative w-[375px] h-[812px] overflow-hidden">
      {/*
        DotLottieReact renders a <canvas>. CSS class sizing on canvases is
        flaky — give it explicit pixel attrs (width/height) AND a CSS style so
        the drawing buffer + display size both match the iPhone frame. `fit`
        is a dotlottie-web Config option (contain | cover | fill | …); the
        splash artboard is 1128×2436 (≈ 9:19.5, near-identical to the iPhone
        14 frame), so `cover` fills edge-to-edge with effectively no crop.
      */}
      <DotLottieReact
        src={splashUrl}
        autoplay
        loop={false}
        fit="cover"
        // Explicit attrs prevent the canvas from mounting at 0×0 in
        // Chromium-based browsers (Arc, Chrome) where ResizeObserver fires
        // *after* first paint, sometimes leaving the Lottie tiny and never
        // recovering. autoResize then takes over for any later size changes.
        width={750}
        height={1624}
        renderConfig={{ autoResize: true, devicePixelRatio: 2 }}
        style={{ display: "block", width: "100%", height: "100%" }}
        onComplete={onDone}
      />
    </div>
  );
}
