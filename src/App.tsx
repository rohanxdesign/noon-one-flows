import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SubscribedUser from "./components/SubscribedUser";
import ManageMembership, { type PlanState } from "./components/ManageMembership";
import ChangePlan from "./components/ChangePlan";
import CancelMembership from "./components/CancelMembership";
import CancelFeedback from "./components/CancelFeedback";
import CancelConfirmation from "./components/CancelConfirmation";
import PostCancel from "./components/PostCancel";
import PaymentMethod from "./components/PaymentMethod";
import SplashScreen from "./components/SplashScreen";
import SmoothCorners from "./components/SmoothCorners";
import {
  SkeletonGate,
  HomeSkeleton,
  ManageSkeleton,
  ChangePlanSkeleton,
  CancelSkeleton,
  CancelFeedbackSkeleton,
  PostCancelSkeleton,
  PaymentMethodSkeleton,
} from "./components/Skeleton";
import { Retune } from "retune";

type Screen =
  | "home"
  | "manage"
  | "changePlan"
  | "cancel"
  | "cancelFeedback"
  | "cancelled"
  | "postCancel"
  | "paymentMethod";

type Direction = "forward" | "back";

// iOS-style page slide. Forward: new page enters from the right while the old
// page slides off to the left. Back: mirrored. The exiting page parallaxes
// only 25% so the incoming page reads as "on top of the stack".
const pageVariants = {
  enter: (dir: Direction) => ({
    x: dir === "forward" ? "100%" : "-25%",
  }),
  center: { x: "0%" },
  exit: (dir: Direction) => ({
    x: dir === "forward" ? "-25%" : "100%",
  }),
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const [direction, setDirection] = useState<Direction>("forward");
  // The user's current plan. Starts as "monthly"; bumps when they confirm an
  // upgrade in the ChangePlan flow. We also track whether the active plan was
  // upgraded *during this session* so the Manage Membership tag can read
  // "Upgraded plan" instead of "Current plan" right after the change.
  const [planId, setPlanId] = useState<PlanState>("monthly");
  const [isUpgraded, setIsUpgraded] = useState(false);

  const navigate = (next: Screen, dir: Direction) => {
    setDirection(dir);
    setScreen(next);
  };

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

  const renderScreen = () => {
    switch (screen) {
      case "changePlan":
        return (
          <SkeletonGate skeleton={<ChangePlanSkeleton />}>
            <ChangePlan
              onBack={() => navigate("manage", "back")}
              onConfirmPlan={(newPlanId) => {
                setPlanId(newPlanId);
                setIsUpgraded(true);
                navigate("manage", "back");
              }}
            />
          </SkeletonGate>
        );
      case "cancel":
        return (
          <SkeletonGate skeleton={<CancelSkeleton />}>
            <CancelMembership
              onBack={() => navigate("manage", "back")}
              onKeepMembership={() => navigate("manage", "back")}
              onContinueCancellation={() => navigate("cancelFeedback", "forward")}
            />
          </SkeletonGate>
        );
      case "cancelFeedback":
        return (
          <SkeletonGate skeleton={<CancelFeedbackSkeleton />}>
            <CancelFeedback
              onBack={() => navigate("cancel", "back")}
              onKeepMembership={() => navigate("manage", "back")}
              onContinueCancellation={() => navigate("cancelled", "forward")}
            />
          </SkeletonGate>
        );
      case "cancelled":
        // No skeleton: this screen has no loaded content — its first phase
        // is itself a held-icon moment. A pre-roll skeleton would just push
        // the phase 1 → phase 2 reveal back behind a meaningless shimmer.
        return (
          <CancelConfirmation
            onDismiss={() => navigate("postCancel", "forward")}
          />
        );
      case "postCancel":
        return (
          <SkeletonGate skeleton={<PostCancelSkeleton />}>
            <PostCancel
              onManageMembership={() => navigate("manage", "forward")}
              onContinueOffer={() => navigate("home", "back")}
            />
          </SkeletonGate>
        );
      case "manage":
        return (
          <SkeletonGate skeleton={<ManageSkeleton />}>
            <ManageMembership
              onBack={() => navigate("home", "back")}
              onChangePlan={() => navigate("changePlan", "forward")}
              onCancelMembership={() => navigate("cancel", "forward")}
              onChangePaymentMethod={() => navigate("paymentMethod", "forward")}
              planId={planId}
              isUpgraded={isUpgraded}
            />
          </SkeletonGate>
        );
      case "paymentMethod":
        return (
          <SkeletonGate skeleton={<PaymentMethodSkeleton />}>
            <PaymentMethod
              onBack={() => navigate("manage", "back")}
              onPay={() => navigate("manage", "back")}
            />
          </SkeletonGate>
        );
      case "home":
      default:
        return (
          <SkeletonGate skeleton={<HomeSkeleton />}>
            <SubscribedUser onManageMembership={() => navigate("manage", "forward")} />
          </SkeletonGate>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-[#e5e5e5] py-8">
      <SmoothCorners radius={20} className="shadow-2xl">
        {showSplash ? (
          <SplashScreen onDone={() => setShowSplash(false)} />
        ) : (
          <div className="relative w-[375px] h-[812px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.div
                key={screen}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0"
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </SmoothCorners>
      {import.meta.env.DEV && <Retune port={9225} />}
    </div>
  );
}
