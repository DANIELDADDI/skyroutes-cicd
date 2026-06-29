/**
 * FlightList.jsx
 * Path: 003_PROJECT/vite-project/src/components/flights/FlightList.jsx
 *
 */

import { useState } from "react";
import {Box, Typography, Button, Divider, Collapse,Skeleton, IconButton, useMediaQuery,} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {ExpandMore, ExpandLess,Luggage, AccessTime, Airlines,CheckCircleOutlineOutlined, CancelOutlined, ArrowForwardIos, WorkOutlineOutlined, AirplanemodeActive, FiberManualRecord,} from "@mui/icons-material";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const parseDuration = (iso) => {
      const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      if (!m) return iso || "";
      const h = m[1] ? `${m[1]}h` : "";
      const min = m[2] ? ` ${m[2]}m` : "";
      return `${h}${min}`.trim();
};

const fmtTime = (iso) => {
      if (!iso) return "--:--";
      const d = new Date(iso);
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const fmtDate = (iso) => {
      if (!iso) return "";
      return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const dayDiff = (dep, arr) => {
      if (!dep || !arr) return 0;
      const d = Math.floor((new Date(arr) - new Date(dep)) / 86400000);
      return d;
};

const CABIN_LABEL = { ECONOMY: "Economy", BUSINESS: "Business", FIRST: "First Class" };

const CURRENCY_SYMBOL = { KWD: "KD", USD: "$", EUR: "€" };

// ─────────────────────────────────────────────────────────────────────────────
// Mock data – remove when wiring real Amadeus results
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_FLIGHTS = [
      {
            id: "f1",
            airline: { code: "KU", name: "Kuwait Airways" },
            legs: [
                  {
                        origin: { code: "KWI", city: "Kuwait City", name: "Kuwait International" },
                        destination: { code: "LHR", city: "London", name: "Heathrow" },
                        departure: "2025-09-14T08:00:00",
                        arrival: "2025-09-14T13:45:00",
                        duration: "PT7H45M",
                        stops: 0,
                        stopDetails: [],
                        aircraft: "Boeing 777-300ER",
                        cabin: "ECONOMY",
                        baggage: { cabin: "7 kg", checked: "23 kg" },
                        flightNumber: "KU 101",
                  },
                  {
                        origin: { code: "LHR", city: "London", name: "Heathrow" },
                        destination: { code: "KWI", city: "Kuwait City", name: "Kuwait International" },
                        departure: "2025-09-21T15:30:00",
                        arrival: "2025-09-22T00:20:00",
                        duration: "PT6H50M",
                        stops: 0,
                        stopDetails: [],
                        aircraft: "Boeing 777-300ER",
                        cabin: "ECONOMY",
                        baggage: { cabin: "7 kg", checked: "23 kg" },
                        flightNumber: "KU 102",
                  },
            ],
            price: { amount: 245, currency: "KWD", breakdown: { base: 200, tax: 45, total: 245 } },
            seatsLeft: 4,
            refundable: true,
            tags: ["Best Value"],
      },
      {
            id: "f2",
            airline: { code: "EK", name: "Emirates" },
            legs: [
                  {
                        origin: { code: "KWI", city: "Kuwait City", name: "Kuwait International" },
                        destination: { code: "LHR", city: "London", name: "Heathrow" },
                        departure: "2025-09-14T23:55:00",
                        arrival: "2025-09-15T07:30:00",
                        duration: "PT9H35M",
                        stops: 1,
                        stopDetails: [{ code: "DXB", city: "Dubai", duration: "PT1H40M" }],
                        aircraft: "Airbus A380",
                        cabin: "ECONOMY",
                        baggage: { cabin: "7 kg", checked: "30 kg" },
                        flightNumber: "EK 855",
                  },
            ],
            price: { amount: 189, currency: "KWD", breakdown: { base: 155, tax: 34, total: 189 } },
            seatsLeft: 12,
            refundable: false,
            tags: ["Cheapest"],
      },
      {
            id: "f3",
            airline: { code: "QR", name: "Qatar Airways" },
            legs: [
                  {
                        origin: { code: "KWI", city: "Kuwait City", name: "Kuwait International" },
                        destination: { code: "LHR", city: "London", name: "Heathrow" },
                        departure: "2025-09-14T06:20:00",
                        arrival: "2025-09-14T12:15:00",
                        duration: "PT7H55M",
                        stops: 1,
                        stopDetails: [{ code: "DOH", city: "Doha", duration: "PT1H10M" }],
                        aircraft: "Boeing 787-9",
                        cabin: "BUSINESS",
                        baggage: { cabin: "15 kg", checked: "2 × 32 kg" },
                        flightNumber: "QR 1090",
                  },
                  {
                        origin: { code: "LHR", city: "London", name: "Heathrow" },
                        destination: { code: "KWI", city: "Kuwait City", name: "Kuwait International" },
                        departure: "2025-09-21T20:00:00",
                        arrival: "2025-09-22T04:55:00",
                        duration: "PT6H55M",
                        stops: 1,
                        stopDetails: [{ code: "DOH", city: "Doha", duration: "PT1H05M" }],
                        aircraft: "Boeing 787-9",
                        cabin: "BUSINESS",
                        baggage: { cabin: "15 kg", checked: "2 × 32 kg" },
                        flightNumber: "QR 1091",
                  },
            ],
            price: { amount: 890, currency: "KWD", breakdown: { base: 750, tax: 140, total: 890 } },
            seatsLeft: 2,
            refundable: true,
            tags: ["Fastest", "Business"],
      },
];

// ─────────────────────────────────────────────────────────────────────────────
// THEME CONFIGS  (mirror design.jsx tokens exactly)
// ─────────────────────────────────────────────────────────────────────────────
const THEME_MIDNIGHT = {
      id: 1,
      name: "Gulf Midnight",
      mode: "dark",
      pageBg: "radial-gradient(ellipse at 20% 30%, #0A2A4A 0%, #050E1A 60%)",
      cardBg: "rgba(255,255,255,0.05)",
      cardBorder: "rgba(0,212,180,0.15)",
      cardHoverBg: "rgba(0,212,180,0.04)",
      cardSelectedBg: "rgba(0,212,180,0.09)",
      cardSelectedBorder: "#00D4B4",
      accentColor: "#00D4B4",
      accentHover: "#00B89C",
      secondaryColor: "#FF6B35",
      textColor: "#F0F8FF",
      subTextColor: "#8BAFC8",
      mutedColor: "#4A6580",
      divider: "rgba(255,255,255,0.08)",
      tagBg: "rgba(0,212,180,0.12)",
      tagColor: "#00D4B4",
      priceBg: "rgba(0,212,180,0.08)",
      priceColor: "#00D4B4",
      ctaGradient: "linear-gradient(135deg,#00D4B4,#0095A8)",
      ctaTextColor: "#050E1A",
      ctaShadow: "0 6px 20px rgba(0,212,180,0.30)",
      stopDot: "#FF6B35",
      skeletonBase: "rgba(255,255,255,0.06)",
      filterBg: "rgba(255,255,255,0.04)",
      filterBorder: "rgba(255,255,255,0.10)",
      detailBg: "rgba(0,212,180,0.04)",
      detailBorder: "rgba(0,212,180,0.10)",
      legSepColor: "rgba(0,212,180,0.20)",
      borderRadius: 16,
      badgeBg: "rgba(255,107,53,0.15)",
      badgeColor: "#FF6B35",
};

const THEME_DESERT = {
      id: 2,
      name: "Desert Sand",
      mode: "light",
      pageBg: "#FAF7F2",
      cardBg: "#FFFFFF",
      cardBorder: "#E8DDD0",
      cardHoverBg: "#FDFAF6",
      cardSelectedBg: "#FFF8F5",
      cardSelectedBorder: "#C0392B",
      accentColor: "#C0392B",
      accentHover: "#A0291E",
      secondaryColor: "#D4A017",
      textColor: "#1A1209",
      subTextColor: "#6B5A48",
      mutedColor: "#A8907A",
      divider: "#EDE0D4",
      tagBg: "#FAF0E4",
      tagColor: "#C0392B",
      priceBg: "#FFF3ED",
      priceColor: "#C0392B",
      ctaGradient: "#C0392B",
      ctaTextColor: "#FFFFFF",
      ctaShadow: "0 4px 16px rgba(192,57,43,0.30)",
      stopDot: "#D4A017",
      skeletonBase: "#F0E8DE",
      filterBg: "#FFFFFF",
      filterBorder: "#E8DDD0",
      detailBg: "#FDF9F5",
      detailBorder: "#EDE0D4",
      legSepColor: "#E8DDD0",
      borderRadius: 4,
      badgeBg: "#FFF0DC",
      badgeColor: "#D4A017",
};

const THEME_CLEANAIR = {
      id: 3,
      name: "Clean Air",
      mode: "light",
      pageBg: "#F0F4FF",
      cardBg: "#FFFFFF",
      cardBorder: "#E5E7EB",
      cardHoverBg: "#FAFBFF",
      cardSelectedBg: "#F5F3FF",
      cardSelectedBorder: "#4F46E5",
      accentColor: "#4F46E5",
      accentHover: "#3730C8",
      secondaryColor: "#06B6D4",
      textColor: "#111827",
      subTextColor: "#6B7280",
      mutedColor: "#9CA3AF",
      divider: "#F3F4F6",
      tagBg: "#EEF2FF",
      tagColor: "#4F46E5",
      priceBg: "#F5F3FF",
      priceColor: "#4F46E5",
      ctaGradient: "linear-gradient(135deg,#4F46E5,#7C3AED)",
      ctaTextColor: "#FFFFFF",
      ctaShadow: "0 6px 20px rgba(79,70,229,0.28)",
      stopDot: "#06B6D4",
      skeletonBase: "#E5E7EB",
      filterBg: "#FFFFFF",
      filterBorder: "#E5E7EB",
      detailBg: "#F8FAFF",
      detailBorder: "#E5E7EB",
      legSepColor: "#E5E7EB",
      borderRadius: 12,
      badgeBg: "#ECFEFF",
      badgeColor: "#06B6D4",
};

const THEMES = { 1: THEME_MIDNIGHT, 2: THEME_DESERT, 3: THEME_CLEANAIR };

// ─────────────────────────────────────────────────────────────────────────────
// MUI base themes (just palette + typography – no layout)
// ─────────────────────────────────────────────────────────────────────────────
const muiMidnight = createTheme({
      palette: { mode: "dark", primary: { main: "#00D4B4" }, background: { default: "#050E1A", paper: "#0C1E30" }, text: { primary: "#F0F8FF", secondary: "#8BAFC8" } },
      typography: { fontFamily: "'Inter','Segoe UI',sans-serif" },
      shape: { borderRadius: 12 },
});
const muiDesert = createTheme({
      palette: { mode: "light", primary: { main: "#C0392B" }, background: { default: "#FAF7F2", paper: "#FFFFFF" }, text: { primary: "#1A1209", secondary: "#6B5A48" } },
      typography: { fontFamily: "'Inter','Segoe UI',sans-serif" },
      shape: { borderRadius: 4 },
});
const muiCleanAir = createTheme({
      palette: { mode: "light", primary: { main: "#4F46E5" }, background: { default: "#F0F4FF", paper: "#FFFFFF" }, text: { primary: "#111827", secondary: "#6B7280" } },
      typography: { fontFamily: "'Inter','Segoe UI',sans-serif" },
      shape: { borderRadius: 12 },
});
const MUI_THEMES = { 1: muiMidnight, 2: muiDesert, 3: muiCleanAir };







// ─────────────────────────────────────────────────────────────────────────────
// FlightTimeline — the dep → arr + stops visual for ONE leg
// ─────────────────────────────────────────────────────────────────────────────
function FlightTimeline({ leg, t, compact = false }) {
      const diff = dayDiff(leg.departure, leg.arrival);
      return (
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flex: 1, minWidth: 0 }}>
                  {/* Departure */}
                  <Box sx={{ textAlign: "left", minWidth: { xs: 52, sm: 64 } }}>
                        <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 800, color: t.textColor, lineHeight: 1 }}>
                              {fmtTime(leg.departure)}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: t.subTextColor, fontWeight: 600, mt: .3 }}>
                              {leg.origin.code}
                        </Typography>
                        {!compact && (
                              <Typography sx={{ fontSize: 10, color: t.mutedColor, display: { xs: "none", sm: "block" } }}>
                                    {fmtDate(leg.departure)}
                              </Typography>
                        )}
                  </Box>

                  {/* Route line */}
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: .4, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 10, color: t.subTextColor, fontWeight: 600 }}>
                              {parseDuration(leg.duration)}
                        </Typography>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: .5 }}>
                              <Box sx={{ flex: 1, height: 1, bgcolor: t.mutedColor, opacity: .4 }} />
                              {leg.stops === 0 ? (
                                    <AirplanemodeActive sx={{ fontSize: { xs: 14, sm: 16 }, color: t.accentColor, transform: "rotate(45deg)" }} />
                              ) : (
                                    Array.from({ length: leg.stops }).map((_, i) => (
                                          <FiberManualRecord key={i} sx={{ fontSize: 7, color: t.stopDot }} />
                                    ))
                              )}
                              <Box sx={{ flex: 1, height: 1, bgcolor: t.mutedColor, opacity: .4 }} />
                        </Box>
                        <Typography sx={{ fontSize: 10, color: leg.stops === 0 ? t.accentColor : t.stopDot, fontWeight: 700 }}>
                              {leg.stops === 0 ? "Direct" : `${leg.stops} stop${leg.stops > 1 ? "s" : ""}`}
                        </Typography>
                  </Box>

                  {/* Arrival */}
                  <Box sx={{ textAlign: "right", minWidth: { xs: 52, sm: 64 } }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: .3 }}>
                              <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 800, color: t.textColor, lineHeight: 1 }}>
                                    {fmtTime(leg.arrival)}
                              </Typography>
                              {diff > 0 && (
                                    <Typography sx={{ fontSize: 9, color: t.stopDot, fontWeight: 800, mt: .2 }}>+{diff}</Typography>
                              )}
                        </Box>
                        <Typography sx={{ fontSize: 11, color: t.subTextColor, fontWeight: 600, mt: .3 }}>
                              {leg.destination.code}
                        </Typography>
                        {!compact && (
                              <Typography sx={{ fontSize: 10, color: t.mutedColor, display: { xs: "none", sm: "block" } }}>
                                    {fmtDate(leg.arrival)}
                              </Typography>
                        )}
                  </Box>
            </Box>
      );
}





// ─────────────────────────────────────────────────────────────────────────────
// LegDetail — expanded per-leg detail strip
// ─────────────────────────────────────────────────────────────────────────────
function LegDetail({ leg, t, label }) {
      return (
            <Box sx={{ bgcolor: t.detailBg, border: `1px solid ${t.detailBorder}`, borderRadius: `${t.borderRadius * 0.6}px`, p: { xs: 1.5, sm: 2 }, mb: 1 }}>
                  {label && (
                        <Typography sx={{ fontSize: 10, fontWeight: 800, color: t.accentColor, textTransform: "uppercase", letterSpacing: 1.2, mb: 1.5 }}>
                              {label}
                        </Typography>
                  )}

                  {/* Cities */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
                        <Box>
                              <Typography sx={{ fontSize: 13, fontWeight: 800, color: t.textColor }}>{leg.origin.city} ({leg.origin.code})</Typography>
                              <Typography sx={{ fontSize: 11, color: t.subTextColor }}>{leg.origin.name}</Typography>
                              <Typography sx={{ fontSize: 12, color: t.accentColor, fontWeight: 700, mt: .3 }}>{fmtTime(leg.departure)} · {fmtDate(leg.departure)}</Typography>
                        </Box>
                        <ArrowForwardIos sx={{ fontSize: 13, color: t.mutedColor, mx: .5 }} />
                        <Box>
                              <Typography sx={{ fontSize: 13, fontWeight: 800, color: t.textColor }}>{leg.destination.city} ({leg.destination.code})</Typography>
                              <Typography sx={{ fontSize: 11, color: t.subTextColor }}>{leg.destination.name}</Typography>
                              <Typography sx={{ fontSize: 12, color: t.accentColor, fontWeight: 700, mt: .3 }}>{fmtTime(leg.arrival)} · {fmtDate(leg.arrival)}</Typography>
                        </Box>
                  </Box>

                  {/* Info row */}
                  <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, flexWrap: "wrap" }}>
                        {[
                              { icon: <Airlines sx={{ fontSize: 14 }} />, text: leg.flightNumber },
                              { icon: <AirplanemodeActive sx={{ fontSize: 14 }} />, text: leg.aircraft },
                              { icon: <AccessTime sx={{ fontSize: 14 }} />, text: parseDuration(leg.duration) },
                              { icon: <WorkOutlineOutlined sx={{ fontSize: 14 }} />, text: CABIN_LABEL[leg.cabin] || leg.cabin },
                              { icon: <Luggage sx={{ fontSize: 14 }} />, text: `Cabin: ${leg.baggage.cabin}` },
                              { icon: <Luggage sx={{ fontSize: 14 }} />, text: `Hold: ${leg.baggage.checked}` },
                        ].map(({ icon, text }, i) => (
                              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: .5 }}>
                                    <Box sx={{ color: t.subTextColor }}>{icon}</Box>
                                    <Typography sx={{ fontSize: 11, color: t.subTextColor }}>{text}</Typography>
                              </Box>
                        ))}
                  </Box>

                  {/* Stop detail */}
                  {leg.stopDetails?.length > 0 && (
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${t.divider}` }}>
                              {leg.stopDetails.map((s, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: .8 }}>
                                          <FiberManualRecord sx={{ fontSize: 7, color: t.stopDot }} />
                                          <Typography sx={{ fontSize: 11, color: t.subTextColor }}>
                                                Layover in <b style={{ color: t.textColor }}>{s.city} ({s.code})</b> · {parseDuration(s.duration)}
                                          </Typography>
                                    </Box>
                              ))}
                        </Box>
                  )}
            </Box>
      );
}






// ─────────────────────────────────────────────────────────────────────────────
// FlightCard — one result row (works for any tripType)
// ─────────────────────────────────────────────────────────────────────────────

function FlightCard({ flight, tripType, t, currency, onSelect, isSelected, setSelected }) {
      const [expanded, setExpanded] = useState(false);
      const sym = CURRENCY_SYMBOL[currency] || currency;
      const isMobile = useMediaQuery("(max-width:600px)");

      const toggleExpand = (e) => { e.stopPropagation(); setExpanded(v => !v); };
      const handleSelect = () => { setSelected(flight.id); onSelect?.(flight); };

      const legLabels = tripType === "round"
            ? ["Outbound", "Return"]
            : tripType === "multicity"
                  ? flight.legs.map((_, i) => `Flight ${i + 1}`)
                  : [null];

      return (
            <Box
                  onClick={handleSelect}
                  sx={{
                        bgcolor: isSelected ? t.cardSelectedBg : t.cardBg,
                        border: `1.5px solid ${isSelected ? t.cardSelectedBorder : t.cardBorder}`,
                        borderRadius: `${t.borderRadius}px`,
                        mb: 2,
                        cursor: "pointer",
                        transition: "all .2s",
                        overflow: "hidden",
                        "&:hover": {
                              bgcolor: isSelected ? t.cardSelectedBg : t.cardHoverBg,
                              borderColor: isSelected ? t.cardSelectedBorder : t.accentColor,
                              boxShadow: `0 4px 24px ${t.accentColor}18`,
                              transform: "translateY(-1px)",
                        },
                  }}
            >
                  {/* ── Tags strip ─────────────────────────────────────────────────────── */}
                  {flight.tags?.length > 0 && (
                        <Box sx={{ display: "flex", gap: .75, px: 2, pt: 1.2, pb: .5, flexWrap: "wrap" }}>
                              {flight.tags.map(tag => (
                                    <Box key={tag}
                                          sx={{
                                                px: 1, py: .15, borderRadius: 4, bgcolor: t.tagBg,
                                                fontSize: 10, fontWeight: 800, color: t.tagColor, letterSpacing: .4
                                          }}>
                                          {tag}
                                    </Box>
                              ))}
                              {flight.seatsLeft <= 5 && (
                                    <Box sx={{
                                          px: 1, py: .15, borderRadius: 4, bgcolor: t.badgeBg,
                                          fontSize: 10, fontWeight: 800, color: t.badgeColor, letterSpacing: .4
                                    }}>
                                          🔥 {flight.seatsLeft} seats left
                                    </Box>
                              )}
                        </Box>
                  )}

                  {/* ── Main row ───────────────────────────────────────────────────────── */}
                  <Box sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", md: "nowrap" } }}>

                        {/* Airline badge */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: { xs: "100%", sm: 130, md: 120 }, mb: { xs: .5, sm: 0 } }}>
                              <Box sx={{
                                    width: 40, height: 40, borderRadius: `${t.borderRadius * 0.5}px`,
                                    bgcolor: `${t.accentColor}14`, display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 900, fontSize: 14, color: t.accentColor, flexShrink: 0, letterSpacing: .5,
                              }}>
                                    {flight.airline.code}
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: t.textColor, lineHeight: 1.2 }} noWrap>
                                          {flight.airline.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 10, color: t.subTextColor }}>
                                          {flight.legs[0].cabin === "BUSINESS" ? "✦ Business" : flight.legs[0].cabin === "FIRST" ? "✦ First" : "Economy"}
                                    </Typography>
                              </Box>
                        </Box>

                        {/* Leg timelines */}
                        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                              {flight.legs.map((leg, i) => (
                                    <Box key={i}>
                                          {tripType !== "oneway" && flight.legs.length > 1 && (
                                                <Typography sx={{ fontSize: 9, fontWeight: 800, color: t.mutedColor, textTransform: "uppercase", letterSpacing: 1, mb: .4 }}>
                                                      {legLabels[i] || `Leg ${i + 1}`}
                                                </Typography>
                                          )}
                                          <FlightTimeline leg={leg} t={t} compact={isMobile} />
                                          {i < flight.legs.length - 1 && (
                                                <Divider sx={{ borderColor: t.legSepColor, mt: 1 }} />
                                          )}
                                    </Box>
                              ))}
                        </Box>

                        {/* Price + CTA */}
                        <Box sx={{
                              display: "flex", flexDirection: { xs: "row", sm: "column" }, alignItems: { xs: "center", sm: "flex-end" },
                              justifyContent: { xs: "space-between", sm: "center" }, gap: 1,
                              minWidth: { xs: "100%", sm: 120, md: 140 }, mt: { xs: 1, sm: 0 },
                              pl: { sm: 1 }, borderLeft: { sm: `1px solid ${t.divider}` },
                        }}>
                              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                                    <Box sx={{ bgcolor: t.priceBg, px: 1.2, py: .4, borderRadius: `${t.borderRadius * 0.5}px`, display: "inline-block" }}>
                                          <Typography sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 900, color: t.priceColor, lineHeight: 1 }}>
                                                {sym} {flight.price.amount.toLocaleString()}
                                          </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: 10, color: t.subTextColor, mt: .4, textAlign: { xs: "left", sm: "right" } }}>
                                          per person · {tripType === "round" ? "return" : tripType === "multicity" ? "all legs" : "one way"}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: .5, mt: .5, justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
                                          {flight.refundable
                                                ? <Box sx={{ display: "flex", alignItems: "center", gap: .3 }}><CheckCircleOutlineOutlined sx={{ fontSize: 11, color: "#22c55e" }} /><Typography sx={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>Refundable</Typography></Box>
                                                : <Box sx={{ display: "flex", alignItems: "center", gap: .3 }}><CancelOutlined sx={{ fontSize: 11, color: t.mutedColor }} /><Typography sx={{ fontSize: 10, color: t.mutedColor }}>Non-refundable</Typography></Box>
                                          }
                                    </Box>
                              </Box>

                              <Button
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleSelect(); }}
                                    sx={{
                                          background: t.ctaGradient,
                                          color: t.ctaTextColor,
                                          fontWeight: 800,
                                          fontSize: 13,
                                          px: 2,
                                          py: .8,
                                          borderRadius: `${t.borderRadius * 0.7}px`,
                                          textTransform: "none",
                                          boxShadow: t.ctaShadow,
                                          whiteSpace: "nowrap",
                                          "&:hover": { opacity: .92 },
                                    }}
                              >
                                    Select
                              </Button>
                        </Box>
                  </Box>

                  {/* ── Expand toggle ──────────────────────────────────────────────────── */}
                  <Box
                        onClick={toggleExpand}
                        sx={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: .5,
                              py: .6, cursor: "pointer", borderTop: `1px solid ${t.divider}`,
                              bgcolor: `${t.accentColor}06`,
                              "&:hover": { bgcolor: `${t.accentColor}0F` },
                              transition: "background .15s",
                        }}
                  >
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: t.subTextColor }}>
                              {expanded ? "Hide details" : "Flight details"}
                        </Typography>
                        {expanded
                              ? <ExpandLess sx={{ fontSize: 15, color: t.subTextColor }} />
                              : <ExpandMore sx={{ fontSize: 15, color: t.subTextColor }} />
                        }
                  </Box>

                  {/* ── Expanded detail panel ──────────────────────────────────────────── */}
                  <Collapse in={expanded}>
                        <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: 1.5 }}>
                              {/* Per-leg detail */}
                              {flight.legs.map((leg, i) => (
                                    <LegDetail key={i} leg={leg} t={t} label={flight.legs.length > 1 ? (legLabels[i] || `Leg ${i + 1}`) : null} />
                              ))}

                              {/* Price breakdown */}
                              <Box sx={{ mt: 1.5, bgcolor: t.detailBg, border: `1px solid ${t.detailBorder}`, borderRadius: `${t.borderRadius * 0.6}px`, p: { xs: 1.5, sm: 2 } }}>
                                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: t.accentColor, textTransform: "uppercase", letterSpacing: 1, mb: 1.5 }}>
                                          Price Breakdown
                                    </Typography>
                                    {[
                                          ["Base fare", flight.price.breakdown.base],
                                          ["Taxes & fees", flight.price.breakdown.tax],
                                    ].map(([label, val]) => (
                                          <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: .6 }}>
                                                <Typography sx={{ fontSize: 12, color: t.subTextColor }}>{label}</Typography>
                                                <Typography sx={{ fontSize: 12, color: t.textColor, fontWeight: 600 }}>{sym} {val.toLocaleString()}</Typography>
                                          </Box>
                                    ))}
                                    <Divider sx={{ borderColor: t.divider, my: 1 }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                          <Typography sx={{ fontSize: 13, fontWeight: 800, color: t.textColor }}>Total</Typography>
                                          <Typography sx={{ fontSize: 16, fontWeight: 900, color: t.priceColor }}>{sym} {flight.price.amount.toLocaleString()}</Typography>
                                    </Box>
                              </Box>
                        </Box>
                  </Collapse>
            </Box>
      );
}





// ─────────────────────────────────────────────────────────────────────────────
// SkeletonCard
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard({ t }) {
      return (
            <Box sx={{ bgcolor: t.cardBg, border: `1.5px solid ${t.cardBorder}`, borderRadius: `${t.borderRadius}px`, p: 2, mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                        <Skeleton variant="rounded" width={40} height={40} sx={{ bgcolor: t.skeletonBase, borderRadius: `${t.borderRadius * 0.5}px` }} />
                        <Box sx={{ flex: 1 }}>
                              <Skeleton variant="text" width="40%" height={16} sx={{ bgcolor: t.skeletonBase }} />
                              <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: t.skeletonBase, mt: .5 }} />
                              <Skeleton variant="text" width="30%" height={12} sx={{ bgcolor: t.skeletonBase, mt: .5 }} />
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                              <Skeleton variant="rounded" width={90} height={32} sx={{ bgcolor: t.skeletonBase, mb: .5 }} />
                              <Skeleton variant="rounded" width={70} height={30} sx={{ bgcolor: t.skeletonBase }} />
                        </Box>
                  </Box>
            </Box>
      );
}





// ─────────────────────────────────────────────────────────────────────────────
// SortFilterBar
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
      { key: "cheapest", label: "Cheapest" },
      { key: "fastest", label: "Fastest" },
      { key: "best", label: "Best" },
      { key: "earliest", label: "Earliest" },
];

function SortFilterBar({ sort, setSort, count, t }) {
      return (
            <Box sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 1, mb: 2, flexWrap: "wrap",
            }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.subTextColor }}>
                        {count} result{count !== 1 ? "s" : ""} found
                  </Typography>
                  <Box sx={{ display: "flex", gap: .75, flexWrap: "wrap" }}>
                        {SORT_OPTIONS.map(o => (
                              <Box
                                    key={o.key}
                                    onClick={() => setSort(o.key)}
                                    sx={{
                                          px: 1.5, py: .5, borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700,
                                          bgcolor: sort === o.key ? t.accentColor : t.filterBg,
                                          color: sort === o.key ? (t.ctaTextColor) : t.subTextColor,
                                          border: `1px solid ${sort === o.key ? t.accentColor : t.filterBorder}`,
                                          transition: "all .15s",
                                          "&:hover": { borderColor: t.accentColor, color: t.accentColor },
                                    }}
                              >
                                    {o.label}
                              </Box>
                        ))}
                  </Box>
            </Box>
      );
}




// ─────────────────────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ t }) {
      return (
            <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
                  <AirplanemodeActive sx={{ fontSize: 56, color: `${t.accentColor}40`, transform: "rotate(45deg)", mb: 2 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: t.textColor, mb: 1 }}>No flights found</Typography>
                  <Typography sx={{ fontSize: 13, color: t.subTextColor }}>
                        Try adjusting your dates, route, or passenger count.
                  </Typography>
            </Box>
      );
}





// ─────────────────────────────────────────────────────────────────────────────
// Core FlightList component — theme-agnostic, driven by `t` tokens
// ─────────────────────────────────────────────────────────────────────────────

function FlightListCore({ flights = MOCK_FLIGHTS, tripType = "round", t, currency = "KWD", loading = false, onSelect }) {
      const [sort, setSort] = useState("cheapest");
      const [selectedId, setSelectedId] = useState(null);

      const sorted = [...flights].sort((a, b) => {
            if (sort === "cheapest") return a.price.amount - b.price.amount;
            if (sort === "fastest") return a.legs.reduce((s, l) => s + (l.duration || "PT0M").match(/(\d+)H/)?.[1] * 60 + +(l.duration || "PT0M").match(/(\d+)M/)?.[1], 0)
                  - b.legs.reduce((s, l) => s + (l.duration || "PT0M").match(/(\d+)H/)?.[1] * 60 + +(l.duration || "PT0M").match(/(\d+)M/)?.[1], 0);
            if (sort === "earliest") return new Date(a.legs[0].departure) - new Date(b.legs[0].departure);
            return 0; // "best" – keep original order
      });

      return (
            <Box>
                  <SortFilterBar sort={sort} setSort={setSort} count={loading ? 0 : flights.length} t={t} />

                  {loading
                        ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} t={t} />)
                        : sorted.length === 0
                              ? <EmptyState t={t} />
                              : sorted.map(fl => (
                                    <FlightCard
                                          key={fl.id}
                                          flight={fl}
                                          tripType={tripType}
                                          t={t}
                                          currency={currency}
                                          onSelect={onSelect}
                                          isSelected={selectedId === fl.id}
                                          setSelected={setSelectedId}
                                    />
                              ))
                  }
            </Box>
      );
}




// ─────────────────────────────────────────────────────────────────────────────
// Public export — wraps in correct MUI theme + token set
// ─────────────────────────────────────────────────────────────────────────────
export default function FlightList({ design = 1, ...props }) {
      const t = THEMES[design] || THEME_MIDNIGHT;
      const muiTheme = MUI_THEMES[design] || muiMidnight;

      return (
            <ThemeProvider theme={muiTheme}>
                  <Box sx={{ bgcolor: t.pageBg, minHeight: "100vh", p: { xs: 1.5, sm: 3 } }}>
                        <FlightListCore {...props} t={t} />
                  </Box>
            </ThemeProvider>
      );
}






// ─────────────────────────────────────────────────────────────────────────────
// Dev preview — floating design & tripType switcher
// Remove this export if you don't need it in production
// ─────────────────────────────────────────────────────────────────────────────


export function FlightListPreview() {
      const [design, setDesign] = useState(1);
      const [tripType, setTripType] = useState("round");
      const [loading, setLoading] = useState(false);

      const simulateLoad = () => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1800);
      };

      const filteredFlights = tripType === "oneway"
            ? MOCK_FLIGHTS.map(f => ({ ...f, legs: [f.legs[0]] }))
            : tripType === "multicity"
                  ? MOCK_FLIGHTS.map(f => ({
                        ...f,
                        legs: f.legs.length > 1 ? f.legs : [f.legs[0], { ...f.legs[0], origin: f.legs[0].destination, destination: { code: "CDG", city: "Paris", name: "Charles de Gaulle" }, departure: "2025-09-18T11:00:00", arrival: "2025-09-18T13:30:00", duration: "PT2H30M", stops: 0, stopDetails: [], flightNumber: "AF 999" }],
                  }))
                  : MOCK_FLIGHTS;

      return (
            <Box sx={{ position: "relative" }}>
                  <FlightList
                        design={design}
                        tripType={tripType}
                        flights={filteredFlights}
                        currency="KWD"
                        loading={loading}
                        onSelect={(f) => console.log("Selected flight:", f.id)}
                  />

                  {/* Floating controls */}
                  <Box sx={{
                        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
                        zIndex: 9999, display: "flex", gap: .75, alignItems: "center", flexWrap: "wrap",
                        justifyContent: "center",
                        backdropFilter: "blur(16px)", bgcolor: "rgba(0,0,0,0.72)",
                        borderRadius: 10, px: 2, py: 1.2,
                        boxShadow: "0 8px 32px rgba(0,0,0,.45)",
                        border: "1px solid rgba(255,255,255,.10)",
                        maxWidth: "95vw",
                  }}>
                        {/* Design */}
                        <Typography sx={{ color: "rgba(255,255,255,.4)", fontSize: 10, fontWeight: 700, letterSpacing: .5 }}>DESIGN</Typography>
                        {[1, 2, 3].map(d => (
                              <Box key={d} onClick={() => setDesign(d)}
                                    sx={{
                                          px: 1.4, py: .4, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700,
                                          bgcolor: design === d ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.1)",
                                          color: design === d ? "#111" : "rgba(255,255,255,.65)",
                                          "&:hover": { bgcolor: "rgba(255,255,255,.2)" }, transition: "all .15s"
                                    }}>
                                    {["Gulf Midnight", "Desert Sand", "Clean Air"][d - 1]}
                              </Box>
                        ))}

                        <Box sx={{ width: 1, height: 24, bgcolor: "rgba(255,255,255,.12)", mx: .5 }} />

                        {/* Trip type */}
                        <Typography sx={{ color: "rgba(255,255,255,.4)", fontSize: 10, fontWeight: 700, letterSpacing: .5 }}>TRIP</Typography>
                        {["oneway", "round", "multicity"].map(tt => (
                              <Box key={tt} onClick={() => setTripType(tt)}
                                    sx={{
                                          px: 1.4, py: .4, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700,
                                          bgcolor: tripType === tt ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.1)",
                                          color: tripType === tt ? "#111" : "rgba(255,255,255,.65)",
                                          "&:hover": { bgcolor: "rgba(255,255,255,.2)" }, transition: "all .15s"
                                    }}>
                                    {tt}
                              </Box>
                        ))}

                        <Box sx={{ width: 1, height: 24, bgcolor: "rgba(255,255,255,.12)", mx: .5 }} />

                        {/* Loading sim */}
                        <Box onClick={simulateLoad}
                              sx={{
                                    px: 1.4, py: .4, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700,
                                    bgcolor: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.65)",
                                    "&:hover": { bgcolor: "rgba(255,255,255,.2)" }, transition: "all .15s"
                              }}>
                              ↻ Reload
                        </Box>
                  </Box>
            </Box>
      );
}
