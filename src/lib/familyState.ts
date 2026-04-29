// Mock state for the family-sharing prototype.
//
// The prototype's whole point is that it does NOT fork on signals — every
// signal flag is independent and additive. Signals only adjust which entry
// point fires loudly and which module gets initial visual emphasis. The
// canonical flow renders identically with all signals false.

export type Plan = "one" | "duo" | "family";

export type POV = "owner" | "member" | "nonSubscriber";

export interface Signals {
  /** Wi-Fi cluster: 2+ noon accounts on the same network. Cohort C lens. */
  household: boolean;
  /** Owner's account active on 3+ devices. Cohort B lens. */
  deviceOverlap: boolean;
  /** 2+ active solo One subs at the same address. Cohort A lens. */
  dualSubscription: boolean;
  /** Ex-noon-One subscriber; was paying, cancelled. Cohort C' lens. */
  churned: boolean;
  /** ≥ 2 visits to Family page without converting. Cohort D lens (weak). */
  hesitation: boolean;
}

export interface Member {
  name: string;
  initial: string;
  joinedAt: string;
}

export interface FamilyState {
  plan: Plan;
  pov: POV;
  signals: Signals;
  members: Member[];
  inviter?: { name: string; initial: string };
  /** For the recency-of-contact list inside the share-invite sheet. */
  recentlySharedWith: string[];
  /** ISO date string when removal cooldown expires. */
  cooldownUntil?: string;
}

export const noSignals: Signals = {
  household: false,
  deviceOverlap: false,
  dualSubscription: false,
  churned: false,
  hesitation: false,
};

export const defaultState: FamilyState = {
  plan: "family",
  pov: "owner",
  signals: noSignals,
  members: [
    { name: "Kumar Siddharth", initial: "K", joinedAt: "March 3, 2026" },
  ],
  recentlySharedWith: ["Kumar Siddharth", "Aarushi", "Mom", "Yusuf"],
};

export const FAMILY_PLAN_PRICE_AED = 50;
export const DUO_PLAN_PRICE_AED = 30;
export const ONE_PLAN_PRICE_AED = 24.99;
export const FAMILY_SEAT_COUNT = 5;
export const DUO_SEAT_COUNT = 2;

export function perSeatPrice(plan: Plan): number {
  if (plan === "family") return FAMILY_PLAN_PRICE_AED / FAMILY_SEAT_COUNT;
  if (plan === "duo") return DUO_PLAN_PRICE_AED / DUO_SEAT_COUNT;
  return ONE_PLAN_PRICE_AED;
}

export function totalPrice(plan: Plan): number {
  if (plan === "family") return FAMILY_PLAN_PRICE_AED;
  if (plan === "duo") return DUO_PLAN_PRICE_AED;
  return ONE_PLAN_PRICE_AED;
}

export function seatCount(plan: Plan): number {
  if (plan === "family") return FAMILY_SEAT_COUNT;
  if (plan === "duo") return DUO_SEAT_COUNT;
  return 1;
}
