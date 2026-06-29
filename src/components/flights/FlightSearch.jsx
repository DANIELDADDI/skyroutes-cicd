import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import useFlightSearch from "./useFlightSearch";
import FlightSearchForm from "./components/FlightSearchForm";



// ══════════════════════════════════════════════════════════════════════════
// FILE 5 of 5 — DESIGNS + ROOT APP  (Design1 Gulf Midnight · Design2 Desert Sand · Design3 Clean Air · App switcher)
// ══════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────────────
// DESIGN THEME CONFIGS
// Each object is purely tokens — no JSX, no layout.
// ─────────────────────────────────────────────────────────────────────────────

const THEME_MIDNIGHT = {
      accentColor: "#00D4B4",
      accentHover: "#00B89C",
      secondaryColor: "#FF6B35",
      fieldBg: "rgba(255,255,255,0.06)",
      fieldBorder: "rgba(255,255,255,0.14)",
      fieldRadius: 12,
      labelColor: "#8BAFC8",
      textColor: "#F0F8FF",
      subTextColor: "#8BAFC8",
      popoverBg: "#0C1E30",
      legBg: "rgba(255,255,255,0.03)",
      ctaGradient: "linear-gradient(135deg,#00D4B4 0%,#0095A8 100%)",
      ctaGradientHover: "linear-gradient(135deg,#00B89C 0%,#007A8C 100%)",
      ctaTextColor: "#050E1A",
      ctaShadow: "0 8px 24px rgba(0,212,180,0.30)",
      ctaShadowHover: "0 12px 32px rgba(0,212,180,0.50)",
      barBg: "#050E1A",
};

const THEME_DESERT = {
      accentColor: "#C0392B",
      accentHover: "#A0291E",
      secondaryColor: "#D4A017",
      fieldBg: "#FAF7F2",
      fieldBorder: "#D4C4B0",
      fieldRadius: 4,
      labelColor: "#6B5A48",
      textColor: "#1A1209",
      subTextColor: "#6B5A48",
      popoverBg: "#FFFFFF",
      legBg: "#FDF9F5",
      pillTextColor: "#FAF7F2",
      ctaGradient: "#C0392B",
      ctaGradientHover: "#A0291E",
      ctaTextColor: "#FFFFFF",
      ctaShadow: "0 4px 16px rgba(192,57,43,0.35)",
      ctaShadowHover: "0 8px 24px rgba(192,57,43,0.50)",
      barBg: "#1A0A00",
};

const THEME_CLEANAIR = {
      accentColor: "#4F46E5",
      accentHover: "#3730C8",
      secondaryColor: "#06B6D4",
      fieldBg: "#F8FAFF",
      fieldBorder: "#E5E7EB",
      fieldRadius: 12,
      labelColor: "#6B7280",
      textColor: "#111827",
      subTextColor: "#6B7280",
      popoverBg: "#FFFFFF",
      legBg: "#F8FAFF",
      pillTextColor: "#FFFFFF",
      ctaGradient: "linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",
      ctaGradientHover: "linear-gradient(135deg,#3730C8 0%,#6D28D9 100%)",
      ctaTextColor: "#FFFFFF",
      ctaShadow: "0 8px 24px rgba(79,70,229,0.30)",
      ctaShadowHover: "0 12px 32px rgba(79,70,229,0.50)",
      barBg: "#4F46E5",
};

// ─────────────────────────────────────────────────────────────────────────────
// MUI base themes (typography, component overrides)
// ─────────────────────────────────────────────────────────────────────────────

const muiMidnight = createTheme({
      palette: {
            mode: "dark",
            primary: { main: "#00D4B4" },
            background: { default: "#050E1A", paper: "#0C1E30" },
            text: { primary: "#F0F8FF", secondary: "#8BAFC8" },
      },
      typography: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            h4: { fontWeight: 800 },
      },
      shape: { borderRadius: 12 },
      components: {
            MuiAutocomplete: { styleOverrides: { paper: { backgroundColor: "#0C1E30", border: "1px solid rgba(0,212,180,0.15)" } } },
            MuiMenuItem: { styleOverrides: { root: { "&:hover": { backgroundColor: "rgba(0,212,180,0.08)" } } } },
      },
});

const muiDesert = createTheme({
      palette: {
            mode: "light",
            primary: { main: "#C0392B" },
            background: { default: "#FAF7F2", paper: "#FFFFFF" },
            text: { primary: "#1A1209", secondary: "#6B5A48" },
      },
      typography: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            h3: { fontWeight: 700, fontFamily: "'Georgia', serif" },
      },
      shape: { borderRadius: 4 },
});

const muiCleanAir = createTheme({
      palette: {
            mode: "light",
            primary: { main: "#4F46E5" },
            background: { default: "#F0F4FF", paper: "#FFFFFF" },
            text: { primary: "#111827", secondary: "#6B7280" },
      },
      typography: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            h5: { fontWeight: 800 },
      },
      shape: { borderRadius: 12 },
});

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN 1 — Gulf Midnight
// Deep navy glassmorphism · teal accent · subtle dot grid
// ══════════════════════════════════════════════════════════════════════════════
function Design1() {
      const state = useFlightSearch();

      return (
            <ThemeProvider theme={muiMidnight}>
                  <Box
                        sx={{
                              minHeight: "100vh",
                              background: "radial-gradient(ellipse at 20% 30%, #0A2A4A 0%, #050E1A 60%)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              p: { xs: 2, md: 4 },
                              position: "relative", overflow: "hidden",
                              "&::before": {
                                    content: '""', position: "absolute", inset: 0,
                                    backgroundImage: "radial-gradient(circle,rgba(0,212,180,0.07) 1px,transparent 1px)",
                                    backgroundSize: "40px 40px", pointerEvents: "none",
                              },
                        }}
                  >
                        {/* Ambient glow orbs */}
                        <Box sx={{ position: "absolute", top: "10%", left: "6%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,212,180,0.09),transparent 70%)", pointerEvents: "none" }} />
                        <Box sx={{ position: "absolute", bottom: "15%", right: "4%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,53,0.07),transparent 70%)", pointerEvents: "none" }} />

                        <Box sx={{ width: "100%", maxWidth: 1060, position: "relative", zIndex: 1 }}>

                              {/* Brand header */}
                              <Box sx={{ mb: 4, textAlign: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: .5 }}>
                                          <Box sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#00D4B4,#0095A8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <AirplanemodeActive sx={{ fontSize: 20, color: "#050E1A", transform: "rotate(45deg)" }} />
                                          </Box>
                                          <Typography
                                                variant="h4"
                                                sx={{
                                                      background: "linear-gradient(90deg,#00D4B4,#80E8DC)",
                                                      backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                                }}
                                          >
                                                SkyRoute
                                          </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: "#8BAFC8", letterSpacing: 2.5, textTransform: "uppercase", fontSize: 10 }}>
                                          Fly smarter · Gulf & beyond
                                    </Typography>
                              </Box>

                              {/* Glassmorphism card */}
                              <Box
                                    sx={{
                                          backdropFilter: "blur(24px)",
                                          background: "rgba(255,255,255,0.04)",
                                          border: "1px solid rgba(0,212,180,0.15)",
                                          borderRadius: 4,
                                          p: { xs: 2.5, md: 4 },
                                          boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                                    }}
                              >
                                    <FlightSearchForm
                                          {...state}
                                          themeConfig={THEME_MIDNIGHT}
                                          selectorVariant="tabs"
                                    />
                              </Box>

                              {/* Trending chips */}
                              <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                                    {["🔥 Kuwait → Dubai from KD 29", "✈️ London deals this week", "🌍 Europe passes from KD 299", "🇹🇷 Istanbul from KD 89"].map(tag => (
                                          <Chip
                                                key={tag} label={tag} size="small"
                                                sx={{
                                                      bgcolor: "rgba(0,212,180,0.08)", color: "#8BAFC8",
                                                      border: "1px solid rgba(0,212,180,0.15)",
                                                      fontSize: 12,
                                                      "&:hover": { bgcolor: "rgba(0,212,180,0.15)", cursor: "pointer" },
                                                }}
                                          />
                                    ))}
                              </Box>
                        </Box>
                  </Box>
            </ThemeProvider>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN 2 — Desert Sand
// Ivory · terracotta · gold · serif headlines · dune hero
// ══════════════════════════════════════════════════════════════════════════════
function Design2() {
      const state = useFlightSearch();

      return (
            <ThemeProvider theme={muiDesert}>
                  <Box sx={{ minHeight: "100vh", bgcolor: "#FAF7F2" }}>
                        <Box sx={{ bgcolor: "#0b0930", px: { xs: 2, md: 5 }, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AirplanemodeActive sx={{ color: "#fff", transform: "rotate(45deg)", fontSize: 18 }} />
                              </Box>
                              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-.4px" }}>SkyRoute</Typography>
                              <Box
                                    sx={{
                                          ml: 1, px: 1.5, py: .3, borderRadius: 1,
                                          bgcolor: "rgba(255,255,255,0.12)",
                                    }}
                              >
                                    <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600 }}>KWI</Typography>
                              </Box>
                              <Box sx={{ flex: 1 }} />
                              {["Flights", "Hotels", "Manage Booking", "Check-in"].map(l => (
                                    <Typography key={l} sx={{ color: "rgba(255,255,255,.75)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: { xs: "none", md: "block" }, "&:hover": { color: "#fff" } }}>{l}</Typography>
                              ))}
                        </Box>

                        {/* Hero with starfield + dune silhouette */}
                        <Box
                              sx={{
                                    position: "relative", height: { xs: 260, md: 380 },
                                    background: "linear-gradient(160deg,#1A0A00 0%,#3D1A0A 40%,#6B2A10 75%,#8B3A15 100%)",
                                    overflow: "hidden",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                              }}
                        >
                              {/* Stars */}
                              {[...Array(22)].map((_, i) => (
                                    <Box key={i} sx={{ position: "absolute", width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: "50%", bgcolor: "#D4A017", opacity: 0.25 + (i % 5) * 0.12, top: `${5 + (i * 19) % 55}%`, left: `${(i * 27 + 9) % 93}%` }} />
                              ))}
                              {/* Dunes */}
                              <Box sx={{ position: "absolute", bottom: 0, left: "-5%", width: "40%", height: 90, bgcolor: "rgba(26,10,0,.8)", borderRadius: "50% 50% 0 0" }} />
                              <Box sx={{ position: "absolute", bottom: 0, right: "3%", width: "50%", height: 110, bgcolor: "rgba(26,10,0,.8)", borderRadius: "50% 50% 0 0" }} />

                              <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 3 }}>
                                    <Typography variant="h3" sx={{ color: "#FAF0DC", mb: 1, fontStyle: "italic", fontSize: { xs: 26, md: 40 } }}>
                                          Where will the wind take you?
                                    </Typography>
                                    <Typography sx={{ color: "#D4A017", fontFamily: "'Inter',sans-serif", letterSpacing: 2.5, textTransform: "uppercase", fontSize: 11 }}>
                                          Flights from Kuwait to everywhere
                                    </Typography>
                              </Box>
                        </Box>

                        {/* Search card overlaps hero */}
                        <Box sx={{ px: { xs: 2, md: 6 }, mt: { xs: -4, md: -7 }, position: "relative", zIndex: 10, maxWidth: 1120, mx: "auto" }}>
                              <Paper elevation={10} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #E8DDD0" }}>
                                    {/* Dark trip-type bar at the top of the card */}
                                    <FlightSearchForm
                                          {...state}
                                          themeConfig={THEME_DESERT}
                                          selectorVariant="bar"
                                    />
                              </Paper>

                              {/* Popular routes */}
                              <Box sx={{ mt: 5, pb: 6 }}>
                                    <Typography variant="h6" sx={{ fontFamily: "'Georgia',serif", mb: 3, color: "#3D1A0A", fontStyle: "italic" }}>
                                          Popular routes from Kuwait
                                    </Typography>
                                    <Grid container spacing={2}>
                                          {[
                                                ["KWI", "DXB", "Kuwait → Dubai", "from KD 29", "1h 15m"],
                                                ["KWI", "IST", "Kuwait → Istanbul", "from KD 120", "4h 30m"],
                                                ["KWI", "LHR", "Kuwait → London", "from KD 199", "7h 45m"],
                                                ["KWI", "CDG", "Kuwait → Paris", "from KD 209", "6h 50m"],
                                          ].map(([, , route, price, dur]) => (
                                                <Grid size={{ xs: 12, md: 3 }} key={route}>
                                                      <Box
                                                            sx={{
                                                                  p: 2.5, border: "1px solid #E8DDD0", borderRadius: 2,
                                                                  cursor: "pointer", bgcolor: "#fff",
                                                                  "&:hover": { borderColor: "#C0392B", boxShadow: "0 4px 16px rgba(192,57,43,0.10)" },
                                                                  transition: "all .2s",
                                                            }}
                                                      >
                                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                  <Typography variant="body2" fontWeight={700}>{route}</Typography>
                                                                  <ArrowForward sx={{ color: "#C0392B", fontSize: 15 }} />
                                                            </Box>
                                                            <Box sx={{ display: "flex", gap: 1.5, mt: 1, alignItems: "center" }}>
                                                                  <Typography variant="h6" sx={{ color: "#C0392B", fontFamily: "'Georgia',serif" }}>{price}</Typography>
                                                                  <Chip label={dur} size="small" sx={{ bgcolor: "#FAF0DC", color: "#6B5A48", fontSize: 11 }} />
                                                            </Box>
                                                      </Box>
                                                </Grid>
                                          ))}
                                    </Grid>
                              </Box>
                        </Box>
                  </Box>
            </ThemeProvider>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// DESIGN 3 — Clean Air
// White · electric indigo · sky cyan · modern airline SaaS feel
// ══════════════════════════════════════════════════════════════════════════════
function Design3() {
      const state = useFlightSearch();

      return (
            <ThemeProvider theme={muiCleanAir}>
                  <Box sx={{ minHeight: "100vh", bgcolor: "#F0F4FF" }}>

                        {/* Topnav */}
                        <Box sx={{ bgcolor: "#4F46E5", px: { xs: 2, md: 5 }, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AirplanemodeActive sx={{ color: "#fff", transform: "rotate(45deg)", fontSize: 18 }} />
                              </Box>
                              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-.4px" }}>SkyRoute</Typography>
                              <Box
                                    sx={{
                                          ml: 1, px: 1.5, py: .3, borderRadius: 1,
                                          bgcolor: "rgba(255,255,255,0.12)",
                                    }}
                              >
                                    <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600 }}>ETH</Typography>
                              </Box>
                              <Box sx={{ flex: 1 }} />
                              {["Flights", "Hotels", "Manage Booking", "Check-in"].map(l => (
                                    <Typography key={l} sx={{ color: "rgba(255,255,255,.75)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: { xs: "none", md: "block" }, "&:hover": { color: "#fff" } }}>{l}</Typography>
                              ))}
                        </Box>

                        {/* Indigo → violet → cyan gradient hero */}
                        <Box
                              sx={{
                                    background: "linear-gradient(135deg,#4F46E5 0%,#7C3AED 55%,#06B6D4 100%)",
                                    pt: 7, pb: 16, px: 3, textAlign: "center",
                                    position: "relative", overflow: "hidden",
                                    "&::after": { content: '""', position: "absolute", bottom: -2, left: 0, right: 0, height: 70, background: "#F0F4FF", borderRadius: "50% 50% 0 0 / 30px 30px 0 0" },
                              }}
                        >
                              {/* Decorative rings */}
                              {[200, 320, 440].map(s => (
                                    <Box key={s} sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: s, height: s, borderRadius: "50%", border: "1px solid rgba(255,255,255,.06)", pointerEvents: "none" }} />
                              ))}
                              <Typography variant="h5" sx={{ color: "#fff", fontSize: { xs: 22, md: 36 }, mb: 1, position: "relative" }}>
                                    Book Your Next Flight
                              </Typography>
                              <Typography variant="body2" sx={{ color: "rgba(255,255,255,.82)", position: "relative" }}>
                                    Best fares guaranteed · No hidden fees · Instant confirmation
                              </Typography>
                        </Box>

                        {/* Search card */}
                        <Box sx={{ px: { xs: 2, md: 4 }, mt: -10, position: "relative", zIndex: 10, maxWidth: 1080, mx: "auto" }}>
                              <Paper
                                    elevation={0}
                                    sx={{
                                          borderRadius: 3,
                                          border: "1px solid #E5E7EB",
                                          boxShadow: "0 4px 48px rgba(79,70,229,.12)",
                                          overflow: "hidden",
                                    }}
                              >
                                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                                          <FlightSearchForm
                                                {...state}
                                                themeConfig={THEME_CLEANAIR}
                                                selectorVariant="pills"
                                          />
                                    </Box>
                              </Paper>

                              {/* Stats row */}
                              <Grid container spacing={2} sx={{ mt: 3 }}>
                                    {[
                                          ["500K+", "Flights booked"],
                                          ["180+", "Destinations"],
                                          ["4.9 ★", "Customer rating"],
                                          ["24/7", "Live support"],
                                    ].map(([num, lbl]) => (
                                          <Grid size={{ xs: 6, md: 3 }} key={lbl}>
                                                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#fff", borderRadius: 2, border: "1px solid #E5E7EB" }}>
                                                      <Typography variant="h5" sx={{ color: "#4F46E5", fontWeight: 800 }}>{num}</Typography>
                                                      <Typography variant="caption" color="text.secondary">{lbl}</Typography>
                                                </Box>
                                          </Grid>
                                    ))}
                              </Grid>

                              {/* Destination cards */}
                              <Box sx={{ mt: 5, pb: 6 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: "#111827" }}>Top destinations</Typography>
                                    <Grid container spacing={2}>
                                          {[
                                                { city: "Dubai", emoji: "🇦🇪", price: "KD 29", tag: "Most popular" },
                                                { city: "Istanbul", emoji: "🇹🇷", price: "KD 89", tag: "Best value" },
                                                { city: "London", emoji: "🇬🇧", price: "KD 199", tag: "Trending" },
                                                { city: "Paris", emoji: "🇫🇷", price: "KD 209", tag: "New route" },
                                          ].map(d => (
                                                <Grid size={{ xs: 6, md: 3 }} key={d.city}>
                                                      <Box
                                                            sx={{
                                                                  p: 2, bgcolor: "#fff", borderRadius: 2,
                                                                  border: "1px solid #E5E7EB", cursor: "pointer",
                                                                  "&:hover": { borderColor: "#4F46E5", boxShadow: "0 4px 20px rgba(79,70,229,.10)", transform: "translateY(-2px)" },
                                                                  transition: "all .2s",
                                                            }}
                                                      >
                                                            <Typography sx={{ fontSize: 28, mb: .5 }}>{d.emoji}</Typography>
                                                            <Typography fontWeight={700}>{d.city}</Typography>
                                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: .5 }}>
                                                                  <Typography sx={{ color: "#4F46E5", fontWeight: 800, fontSize: 15 }}>{d.price}</Typography>
                                                                  <Chip label={d.tag} size="small" sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", fontSize: 10, fontWeight: 700 }} />
                                                            </Box>
                                                      </Box>
                                                </Grid>
                                          ))}
                                    </Grid>
                              </Box>
                        </Box>
                  </Box>
            </ThemeProvider>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT — floating design switcher
// ══════════════════════════════════════════════════════════════════════════════
const DESIGNS = [
      { id: 1, label: "Gulf Midnight", component: Design1 },
      { id: 2, label: "Desert Sand", component: Design2 },
      { id: 3, label: "Clean Air", component: Design3 },
];

export default function FlightSearch() {
      const [active, setActive] = useState(1);
      const Active = DESIGNS.find(d => d.id === active).component;

      return (
            <Box>
                  <Active />

                  {/* Floating switcher pill */}
                  <Box
                        sx={{
                              position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
                              zIndex: 9999, display: "flex", gap: .75, alignItems: "center",
                              backdropFilter: "blur(16px)", bgcolor: "rgba(69, 69, 69, 0.7)",
                              borderRadius: 10, px: 1.5, py: 1,
                              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                              border: "1px solid rgba(255,255,255,.1)",
                        }}
                  >
                        <Typography sx={{ color: "rgba(255,255,255,.4)", fontSize: 8, fontWeight: 600, pr: .5, letterSpacing: .5 }}>
                              DESIGN
                        </Typography>
                        {DESIGNS.map(d => (
                              <Button
                                    key={d.id}
                                    size="small"
                                    onClick={() => setActive(d.id)}
                                    sx={{
                                          minWidth: 0, px: 1.8, py: .5, borderRadius: 8,
                                          fontSize: 8, fontWeight: 700,
                                          bgcolor: active === d.id ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.09)",
                                          color: active === d.id ? "#111" : "rgba(255,255,255,.65)",
                                          "&:hover": { bgcolor: "rgba(255,255,255,.18)" },
                                          transition: "all .18s",
                                    }}
                              >
                                    {d.id} · {d.label}
                              </Button>
                        ))}
                  </Box>
            </Box>
      );
}