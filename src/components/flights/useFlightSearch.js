
// // ══════════════════════════════════════════════════════════════════════════
// // FILE 2 of 5 — STATE HOOK   (useFlightSearch)
// // ══════════════════════════════════════════════════════════════════════════

// import { useCallback, useState } from "react";


// const DEFAULT_PAX = { adults: 1, children: 0, infants: 0 };
// const DEFAULT_LEG = () => ({ origin: null, dest: null, date: "" });

// export default function useFlightSearch() {
//       const [tripType, setTripType] = useState("round");
//       const [origin, setOrigin] = useState(null);
//       const [dest, setDest] = useState(null);
//       const [depart, setDepart] = useState("");
//       const [returnDate, setReturnDate] = useState("");
//       const [pax, setPax] = useState(DEFAULT_PAX);
//       const [currency, setCurrency] = useState("KWD");
//       const [legs, setLegs] = useState([DEFAULT_LEG(), DEFAULT_LEG()]);

//       // ── swap origin ↔ destination ──────────────────────────────────────────────
//       const swapAirports = useCallback(() => {
//             setOrigin(prev => { setDest(prev); return dest; });
//             // eslint-disable-next-line react-hooks/exhaustive-deps
//       }, [dest]);

//       // ── passenger count helpers ───────────────────────────────────────────────
//       // const updatePax = useCallback((type, delta) => {
//       //       setPax(prev => {
//       //             const next = { ...prev, [type]: Math.max(0, prev[type] + delta) };
//       //             if (next.adults < 1) next.adults = 1;
//       //             if (next.infants > next.adults) next.infants = next.adults;
//       //             return next;
//       //       });
//       // }, []);

//       // REPLACE WITH THIS:
//       const MAX_TOTAL = 9;
//       const MAX_CHILDREN = 3;
//       const MAX_INFANTS = 1;

//       const updatePax = useCallback((type, delta) => {
//             setPax(prev => {
//                   const next = { ...prev, [type]: Math.max(0, prev[type] + delta) };

//                   // Floor rules
//                   if (next.adults < 1) next.adults = 1;
//                   if (next.children < 0) next.children = 0;
//                   if (next.infants < 0) next.infants = 0;

//                   // Ceiling rules
//                   if (next.children > MAX_CHILDREN) next.children = MAX_CHILDREN;
//                   if (next.infants > MAX_INFANTS) next.infants = MAX_INFANTS;

//                   // Infants cannot exceed adults
//                   if (next.infants > next.adults) next.infants = next.adults;

//                   // Total cap: adults + children + infants cannot exceed 9
//                   const total = next.adults + next.children + next.infants;
//                   if (total > MAX_TOTAL) {
//                         // Reverse the increment that caused the breach
//                         next[type] = prev[type];
//                   }

//                   return next;
//             });
//       }, []);

//       const totalPax = pax.adults + pax.children + pax.infants;

//       // ── multi-city helpers ────────────────────────────────────────────────────
//       const addLeg = useCallback(() => {
//             setLegs(prev => prev.length < 5 ? [...prev, DEFAULT_LEG()] : prev);
//       }, []);

//       const removeLeg = useCallback((idx) => {
//             setLegs(prev => prev.length > 2 ? prev.filter((_, i) => i !== idx) : prev);
//       }, []);

//       const updateLeg = useCallback((idx, field, value) => {
//             setLegs(prev => {
//                   const next = [...prev];
//                   next[idx] = { ...next[idx], [field]: value };
//                   return next;
//             });
//       }, []);

//       return {
//             tripType, setTripType,
//             origin, setOrigin,
//             dest, setDest,
//             depart, setDepart,
//             returnDate, setReturnDate,
//             pax, updatePax, totalPax,
//             currency, setCurrency,
//             legs, addLeg, removeLeg, updateLeg,
//             swapAirports,
//       };
// }




import { useState, useEffect, useCallback } from "react";

// ─── Storage key ──────────────────────────────────────────────────────────────
const CACHE_KEY = "flightSearch_params";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours — stale after this

// ─── Defaults ────────────────────────────────────────────────────────────────
const DEFAULT_PAX = { adults: 1, children: 0, infants: 0 };
const DEFAULT_LEG = () => ({ origin: null, dest: null, date: "" });

const DEFAULTS = {
      tripType: "round",
      origin: null,
      dest: null,
      depart: "",
      returnDate: "",
      pax: DEFAULT_PAX,
      currency: "KWD",
      legs: [DEFAULT_LEG(), DEFAULT_LEG()],
};

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read and validate the cached search params.
 * Returns DEFAULTS if cache is missing, malformed, or expired.
 */
const loadCache = () => {
      try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return DEFAULTS;

            const parsed = JSON.parse(raw);

            // Expire check
            if (!parsed._savedAt || Date.now() - parsed._savedAt > CACHE_TTL_MS) {
                  localStorage.removeItem(CACHE_KEY);
                  return DEFAULTS;
            }

            // Strip the internal meta key before returning
            const { _savedAt, ...params } = parsed;

            // Merge with DEFAULTS so any new fields added later still get a value
            return { ...DEFAULTS, ...params };

      } catch {
            // JSON parse error or localStorage blocked (private browsing etc.)
            return DEFAULTS;
      }
};

/**
 * Write the current state snapshot to localStorage.
 * Adds a _savedAt timestamp for TTL checking on next load.
 */
const saveCache = (snapshot) => {
      try {
            localStorage.setItem(
                  CACHE_KEY,
                  JSON.stringify({ ...snapshot, _savedAt: Date.now() })
            );
      } catch {
            // localStorage full or blocked — fail silently
      }
};

/**
 * Wipe the cache entirely (call after a successful search submit,
 * or expose as clearSearch() for a "Reset" button).
 */
const clearCache = () => {
      try {
            localStorage.removeItem(CACHE_KEY);
      } catch { /* ignore */ }
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export default function useFlightSearch() {

      // ── Hydrate from cache on first render ───────────────────────────────────
      const cached = loadCache();

      const [tripType, setTripType] = useState(cached.tripType);
      const [origin, setOrigin] = useState(cached.origin);
      const [dest, setDest] = useState(cached.dest);
      const [depart, setDepart] = useState(cached.depart);
      const [returnDate, setReturnDate] = useState(cached.returnDate);
      const [pax, setPax] = useState(cached.pax);
      const [currency, setCurrency] = useState(cached.currency);
      const [legs, setLegs] = useState(cached.legs);

      // ── Persist to localStorage on every state change ────────────────────────
      useEffect(() => {
            saveCache({ tripType, origin, dest, depart, returnDate, pax, currency, legs });
      }, [tripType, origin, dest, depart, returnDate, pax, currency, legs]);

      // ── Swap origin ↔ destination ─────────────────────────────────────────────
      const swapAirports = useCallback(() => {
            setOrigin(prev => {
                  setDest(prev);
                  return dest;
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dest]);

      // ── Passenger helpers ─────────────────────────────────────────────────────
      const MAX_TOTAL = 9;
      const MAX_CHILDREN = 3;
      const MAX_INFANTS = 1;

      const updatePax = useCallback((type, delta) => {
            setPax(prev => {
                  const next = { ...prev, [type]: Math.max(0, prev[type] + delta) };

                  // Floor rules
                  if (next.adults < 1) next.adults = 1;
                  if (next.children < 0) next.children = 0;
                  if (next.infants < 0) next.infants = 0;

                  // Ceiling rules
                  if (next.children > MAX_CHILDREN) next.children = MAX_CHILDREN;
                  if (next.infants > MAX_INFANTS) next.infants = MAX_INFANTS;

                  // Infants cannot exceed adults
                  if (next.infants > next.adults) next.infants = next.adults;

                  // Total cap
                  const total = next.adults + next.children + next.infants;
                  if (total > MAX_TOTAL) {
                        next[type] = prev[type]; // revert the increment that breached the cap
                  }

                  return next;
            });
      }, []);

      const totalPax = pax.adults + pax.children + pax.infants;

      // ── Multi-city helpers ────────────────────────────────────────────────────
      const addLeg = useCallback(() => {
            setLegs(prev => prev.length < 5 ? [...prev, DEFAULT_LEG()] : prev);
      }, []);

      const removeLeg = useCallback((idx) => {
            setLegs(prev => prev.length > 2 ? prev.filter((_, i) => i !== idx) : prev);
      }, []);

      const updateLeg = useCallback((idx, field, value) => {
            setLegs(prev => {
                  const next = [...prev];
                  next[idx] = { ...next[idx], [field]: value };
                  return next;
            });
      }, []);

      // ── Reset — clears state AND cache ───────────────────────────────────────
      const resetSearch = useCallback(() => {
            setTripType(DEFAULTS.tripType);
            setOrigin(DEFAULTS.origin);
            setDest(DEFAULTS.dest);
            setDepart(DEFAULTS.depart);
            setReturnDate(DEFAULTS.returnDate);
            setPax(DEFAULTS.pax);
            setCurrency(DEFAULTS.currency);
            setLegs([DEFAULT_LEG(), DEFAULT_LEG()]);
            clearCache();
      }, []);

      return {
            // State
            tripType, setTripType,
            origin, setOrigin,
            dest, setDest,
            depart, setDepart,
            returnDate, setReturnDate,
            pax, updatePax, totalPax,
            currency, setCurrency,
            legs, addLeg, removeLeg, updateLeg,
            // Actions
            swapAirports,
            resetSearch,
            // Limits (expose so components can read them without hardcoding)
            limits: { MAX_TOTAL, MAX_CHILDREN, MAX_INFANTS },
      };
}

