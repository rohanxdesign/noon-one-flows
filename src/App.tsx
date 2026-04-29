import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Existing noon One flows (kept intact)
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

// Family-sharing unified flow
import LandingPageFamily from "./components/family/LandingPageFamily";
import ChoosePlan from "./components/family/ChoosePlan";
import PlanDetailFamily from "./components/family/PlanDetailFamily";
import ReviewAndPay from "./components/family/ReviewAndPay";
import SuccessWithInvitePrompt from "./components/family/SuccessWithInvitePrompt";
import SubscribedHomeFamilyCard from "./components/family/SubscribedHomeFamilyCard";
import ManageMembersScreen from "./components/family/ManageMembersScreen";
import ShareInviteSheet from "./components/family/ShareInviteSheet";
import InviteLandingScreen from "./components/family/InviteLandingScreen";
import JoiningTransition from "./components/family/JoiningTransition";
import JoinSuccess from "./components/family/JoinSuccess";
import MemberHomeScreen from "./components/family/MemberHomeScreen";
import LeaveConfirmation from "./components/family/LeaveConfirmation";
import PrototypeModePicker from "./components/family/PrototypeModePicker";

import { defaultState, type FamilyState, type Plan, type POV, type Signals } from "./lib/familyState";
import { Retune } from "retune";

type Screen =
  // Family unified flow
  | "landing"
  | "choosePlan"
  | "planDetail"
  | "reviewAndPay"
  | "successInvite"
  | "subscribedHomeFamily"
  | "manageMembers"
  | "inviteLanding"
  | "joiningTransition"
  | "joinSuccess"
  | "memberHome"
  // Legacy noon One flows (still reachable)
  | "home"
  | "manage"
  | "changePlan"
  | "cancel"
  | "cancelFeedback"
  | "cancelled"
  | "postCancel"
  | "paymentMethod";

type Direction = "forward" | "back";

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
  const [screen, setScreen] = useState<Screen>("landing");
  const [direction, setDirection] = useState<Direction>("forward");

  // Family-sharing state (cohort-agnostic; signals are independent + additive)
  const [familyState, setFamilyState] = useState<FamilyState>(defaultState);

  // Sheet overlays (render on top of the current screen)
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false);

  // The plan the user picked in choosePlan — pipes through to plan-detail / pay
  const [pickedPlan, setPickedPlan] = useState<Plan>("family");

  // Existing legacy state (keep so the old flows still demo)
  const [legacyPlanId, setLegacyPlanId] = useState<PlanState>("monthly");
  const [legacyIsUpgraded, setLegacyIsUpgraded] = useState(false);

  const navigate = (next: Screen, dir: Direction = "forward") => {
    setDirection(dir);
    setScreen(next);
  };

  const SPLASH_MS = 2400;
  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, [showSplash]);

  function setSignals(signals: Signals) {
    setFamilyState((s) => ({ ...s, signals }));
  }

  function setPov(pov: POV) {
    setFamilyState((s) => ({ ...s, pov }));
  }

  function setPlan(plan: Plan) {
    setFamilyState((s) => ({ ...s, plan }));
    setPickedPlan(plan);
  }

  // Renders the active screen.
  const renderScreen = () => {
    switch (screen) {
      // ---- Family unified flow ----
      case "landing":
        return (
          <LandingPageFamily
            signals={familyState.signals}
            onChoosePlan={() => navigate("choosePlan")}
            onSharePlan={() => setShareSheetOpen(true)}
          />
        );

      case "choosePlan":
        return (
          <ChoosePlan
            onBack={() => navigate("landing", "back")}
            onContinue={(plan) => {
              setPickedPlan(plan);
              navigate("planDetail");
            }}
          />
        );

      case "planDetail":
        return (
          <PlanDetailFamily
            plan={pickedPlan}
            signals={familyState.signals}
            onBack={() => navigate("choosePlan", "back")}
            onSubscribe={() => navigate("reviewAndPay")}
          />
        );

      case "reviewAndPay":
        return (
          <ReviewAndPay
            plan={pickedPlan}
            signals={familyState.signals}
            onBack={() => navigate("planDetail", "back")}
            onPay={() => {
              setFamilyState((s) => ({ ...s, plan: pickedPlan, pov: "owner" }));
              navigate("successInvite");
            }}
          />
        );

      case "successInvite":
        return (
          <SuccessWithInvitePrompt
            plan={pickedPlan}
            onInviteFirst={() => {
              navigate("subscribedHomeFamily");
              // Open share sheet right after the screen transition
              setTimeout(() => setShareSheetOpen(true), 420);
            }}
            onInviteLater={() => navigate("subscribedHomeFamily")}
          />
        );

      case "subscribedHomeFamily":
        return (
          <SubscribedHomeFamilyCard
            state={familyState}
            onManageMembership={() => navigate("manage")}
            onManageMembers={() => navigate("manageMembers")}
            onShareInvite={() => setShareSheetOpen(true)}
          />
        );

      case "manageMembers":
        return (
          <ManageMembersScreen
            state={familyState}
            onBack={() => navigate("subscribedHomeFamily", "back")}
            onShareInvite={() => setShareSheetOpen(true)}
          />
        );

      // Member-side flow
      case "inviteLanding":
        return (
          <InviteLandingScreen
            inviterName="Rahul"
            inviterInitial="R"
            signals={familyState.signals}
            onJoin={() => navigate("joiningTransition")}
          />
        );

      case "joiningTransition":
        return <JoiningTransition onDone={() => navigate("joinSuccess")} />;

      case "joinSuccess":
        return (
          <JoinSuccess
            inviterName="Rahul"
            inviterInitial="R"
            onContinue={() => {
              setFamilyState((s) => ({
                ...s,
                pov: "member",
                inviter: { name: "Rahul", initial: "R" },
              }));
              navigate("memberHome");
            }}
          />
        );

      case "memberHome":
        return (
          <MemberHomeScreen
            inviterName={familyState.inviter?.name ?? "Rahul"}
            inviterInitial={familyState.inviter?.initial ?? "R"}
            onLeave={() => setLeaveSheetOpen(true)}
          />
        );

      // ---- Legacy noon One flows (kept intact) ----
      case "changePlan":
        return (
          <ChangePlan
            onBack={() => navigate("manage", "back")}
            onConfirmPlan={(newPlanId) => {
              setLegacyPlanId(newPlanId);
              setLegacyIsUpgraded(true);
              navigate("manage", "back");
            }}
          />
        );
      case "cancel":
        return (
          <CancelMembership
            onBack={() => navigate("manage", "back")}
            onKeepMembership={() => navigate("manage", "back")}
            onContinueCancellation={() => navigate("cancelFeedback")}
          />
        );
      case "cancelFeedback":
        return (
          <CancelFeedback
            onBack={() => navigate("cancel", "back")}
            onKeepMembership={() => navigate("manage", "back")}
            onContinueCancellation={() => navigate("cancelled")}
          />
        );
      case "cancelled":
        return (
          <CancelConfirmation
            onDismiss={() => navigate("postCancel")}
          />
        );
      case "postCancel":
        return (
          <PostCancel
            onManageMembership={() => navigate("manage")}
            onContinueOffer={() => navigate("subscribedHomeFamily", "back")}
          />
        );
      case "manage":
        return (
          <ManageMembership
            onBack={() => navigate("subscribedHomeFamily", "back")}
            onChangePlan={() => navigate("changePlan")}
            onCancelMembership={() => navigate("cancel")}
            onChangePaymentMethod={() => navigate("paymentMethod")}
            planId={legacyPlanId}
            isUpgraded={legacyIsUpgraded}
          />
        );
      case "paymentMethod":
        return (
          <PaymentMethod
            onBack={() => navigate("manage", "back")}
            onPay={() => navigate("manage", "back")}
          />
        );
      case "home":
      default:
        return (
          <SubscribedUser
            onManageMembership={() => navigate("manage")}
          />
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

            {/* Sheet overlays — render on top of the active screen */}
            <AnimatePresence>
              {shareSheetOpen && (
                <ShareInviteSheet
                  state={familyState}
                  onDismiss={() => setShareSheetOpen(false)}
                />
              )}
              {leaveSheetOpen && (
                <LeaveConfirmation
                  onCancel={() => setLeaveSheetOpen(false)}
                  onConfirmLeave={() => {
                    setLeaveSheetOpen(false);
                    navigate("inviteLanding", "back");
                    setFamilyState((s) => ({ ...s, pov: "nonSubscriber" }));
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </SmoothCorners>

      {/* Dev-only mode picker — flips signals/POV/Plan to walk the same flow
          with different emphasis. Renders outside the iPhone frame. */}
      {import.meta.env.DEV && !showSplash && (
        <PrototypeModePicker
          pov={familyState.pov}
          plan={familyState.plan}
          signals={familyState.signals}
          onPovChange={setPov}
          onPlanChange={setPlan}
          onSignalsChange={setSignals}
          onJumpTo={(s) => navigate(s as Screen)}
        />
      )}

      {import.meta.env.DEV && <Retune port={9225} />}
    </div>
  );
}
