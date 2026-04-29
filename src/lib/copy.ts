// Copy library for the family-sharing prototype.
//
// Default copy is the no-signal version — what every user sees by default.
// Signal-specific variants are sourced verbatim from the Cohort C flow chart
// in Figma (file kubsiHaVw54DXp94M3YBii, frame 13:17499) and from the team
// alignment call transcript (.context/attachments/pasted_text_2026-04-28...).

import type { Signals } from "./familyState";

export const copy = {
  landing: {
    eyebrow: "noon One Family",
    heroTitle: "Free delivery for your whole household",
    heroSubtitle: "AED 10 per seat with noon One Family",
    primaryCTA: "Choose your plan",
    secondaryCTA: "Share plan details",
  },

  choosePlan: {
    title: "Choose your Plan",
    monthlyTab: "Monthly",
    yearlyTab: "Yearly",
    yearlyBadge: "50% OFF",
    primaryCTA: "Continue",
    bottomReassurance:
      "Your 15-day free trial starts today. After that, it renews monthly.",
  },

  planDetail: {
    trustLineDefault:
      "Same perks. No extra cost. Your account stays yours.",
    privacyEnumeration:
      "Members see your name. They never see your orders, cart, addresses, payment, wishlist, or search.",
    primaryCTA: "Subscribe",
    secondaryCTA: "How it works",
  },

  reviewAndPay: {
    title: "Review & Pay",
    standardCTA: "Confirm & pay",
    atomicMigrationLine:
      "Your existing One plan will be cancelled and a pro-rated refund credited automatically.",
    atomicMigrationCTA: "Upgrade & pay",
  },

  success: {
    standardTitle: "Your household plan is live.",
    standardSubtitle:
      "Now add up to 4 people — your savings start today.",
    inviteFirstCTA: "Invite your first member",
    inviteLaterCTA: "Invite later",
  },

  manageMembers: {
    title: "Your One members",
    privacyLine: "Orders and payments remain private.",
    addMemberCTA: "Add member",
    emptySeatNudge: (remaining: number) =>
      `${remaining} seats waiting. Your household saves more when all 5 are filled.`,
    cooldownExplainer:
      "After removing a member, the seat is free immediately — but you can't invite a new one for 30 days.",
  },

  shareInvite: {
    title: "Share noon One with your family",
    subtitle: "Same perks. No extra cost.",
    inviteUrlLabel: "invite.noon.com/22XC11",
    copyLabel: "Copy",
    primaryCTA: "Share invite",
    benefits: [
      "Your accounts stay separate — orders & payments stay private.",
      "Manage members. Change your +1 once every 30 days.",
    ],
    howItWorks: [
      "Share your invite link with someone you'd like to add.",
      "They open the link and follow a few quick steps.",
      "Both of you can enjoy noon One benefits.",
    ],
    recencyLabel: "Recently shared with",
  },

  invite: {
    landingTitleDefault: (owner: string) =>
      `${owner} invited you to Join noon One Family`,
    landingTitleChurned: (owner: string) =>
      `Welcome back — ${owner} added you to noon One Family`,
    benefits: [
      "Free delivery everywhere — no fees on any orders.",
      "Yango+ streaming — binge watch your favourite shows.",
      "Share the plan, not details — orders & payments stay private.",
    ],
    primaryCTA: "Join for free now",
    autoRenewNote: (owner: string) =>
      `It will auto-renew every month until ${owner} removes you from his noon One account.`,
  },

  joiningTransition: "Upgrading your experience",

  joinSuccess: {
    title: (inviter: string) => `Congratulations — you are a noon One member, thanks to ${inviter}!`,
    verificationLine:
      "Plan linked. Your account stays yours — your cart, orders, and addresses are still only yours.",
    primaryCTA: "Start exploring noon One",
  },

  memberHome: {
    sharedWithLabel: (owner: string) => `Sharing with ${owner}`,
    leaveCTA: "Leave plan",
  },

  leaveConfirmation: {
    title: "Leave noon One Family?",
    body:
      "You'll lose your noon One benefits. The plan owner will be able to invite a new member after 30 days.",
    primaryCTA: "Leave plan",
    secondaryCTA: "Stay",
  },

  errors: {
    alreadyMember: {
      title: "You're already an active member",
      body: "This offer is available only to users without an active noon One subscription.",
      cta: "See my plan",
    },
    maxUsers: {
      title: "Maximum members reached",
      body: "Remove an existing member to invite someone new.",
      cta: "Manage members",
    },
    cooldown: {
      title: "30-day cooldown active",
      body: "You recently changed a member. You can make another change on 15 Feb 2026.",
      cta: "Got it",
    },
    invalidInvite: {
      title: "Invalid or expired link",
      body: "This invite link has expired or is no longer valid. Ask your friend to send a new invitation.",
      cta: "Request new invite",
    },
  },

  // Signal-specific copy variants. The signal isn't a route — it just changes
  // emphasis on the same screen.

  signalEmphasis: {
    landing: {
      household: "Your household orders noon 47 times a month. That's free delivery for 5 people, AED 10 each.",
      dualSubscription: "Two plans, one home. Consolidate and save AED 99/year.",
      deviceOverlap: "Your account is busy. Make it official — give everyone their own login.",
      churned: "Welcome back to noon One — now with a Family plan.",
    },
    planDetail: {
      // Cohort B "make it official" framing — directly from the team call transcript.
      deviceOverlap:
        "They sign up with their own email in 30 seconds, keep using noon One as before, on their own account. Your order history stays with you.",
      // Cohort A consolidation framing.
      dualSubscription:
        "Switch from two solo plans to one Family plan. We'll cancel the other plan and refund the unused balance.",
    },
    profileNotch: {
      deviceOverlap: "Your account is on 4 devices",
    },
  },
};

export function getLandingEmphasis(signals: Signals): string | null {
  if (signals.dualSubscription) return copy.signalEmphasis.landing.dualSubscription;
  if (signals.deviceOverlap) return copy.signalEmphasis.landing.deviceOverlap;
  if (signals.household) return copy.signalEmphasis.landing.household;
  if (signals.churned) return copy.signalEmphasis.landing.churned;
  return null;
}

export function getPlanDetailEmphasis(signals: Signals): string | null {
  if (signals.deviceOverlap) return copy.signalEmphasis.planDetail.deviceOverlap;
  if (signals.dualSubscription) return copy.signalEmphasis.planDetail.dualSubscription;
  return null;
}
