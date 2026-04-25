import { useEffect, useState } from "react";
import SubscribedUser from "./components/SubscribedUser";
import ManageMembership, { type PlanState } from "./components/ManageMembership";
import ChangePlan from "./components/ChangePlan";
import SplashScreen from "./components/SplashScreen";
import SmoothCorners from "./components/SmoothCorners";
import { Retune } from "retune";

type Screen = "home" | "manage" | "changePlan";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  // The user's current plan. Starts as "monthly"; bumps when they confirm an
  // upgrade in the ChangePlan flow. We also track whether the active plan was
  // upgraded *during this session* so the Manage Membership tag can read
  // "Upgraded plan" instead of "Current plan" right after the change.
  const [planId, setPlanId] = useState<PlanState>("monthly");
  const [isUpgraded, setIsUpgraded] = useState(false);

  // Hard cut-off: advance to the home screen at SPLASH_MS regardless of the
  // Lottie's own `complete` event. The animation runs ~3.5s but visually
  // settles earlier, and the post-complete handoff has perceptible lag — so
  // we cut it short. Tweak this single number to taste.
  const SPLASH_MS = 3200;
  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, [showSplash]);

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-[#e5e5e5] py-8">
      <SmoothCorners radius={20} className="shadow-2xl">
        {showSplash ? (
          <SplashScreen onDone={() => setShowSplash(false)} />
        ) : screen === "changePlan" ? (
          <ChangePlan
            onBack={() => setScreen("manage")}
            onConfirmPlan={(newPlanId) => {
              setPlanId(newPlanId);
              setIsUpgraded(true);
              setScreen("manage");
            }}
          />
        ) : screen === "manage" ? (
          <ManageMembership
            onBack={() => setScreen("home")}
            onChangePlan={() => setScreen("changePlan")}
            planId={planId}
            isUpgraded={isUpgraded}
          />
        ) : (
          <SubscribedUser onManageMembership={() => setScreen("manage")} />
        )}
      </SmoothCorners>
      {import.meta.env.DEV && <Retune port={9225} />}
    </div>
  );
}
