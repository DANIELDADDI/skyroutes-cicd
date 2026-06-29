/**
 * FlightSearch.jsx  —  Single-file bundle
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Architecture
 * ────────────
 *  useFlightSearch()      Shared state hook (trip type, airports, dates, pax, currency)
 *
 *  Atom components        Fully reusable, theme-prop-driven:
 *    TripTypeSelector     "tabs" | "pills" | "bar" variants
 *    AirportField         MUI Autocomplete with code-badge dropdown
 *    SwapButton           Animated origin ↔ destination swap
 *    DateField            Date input with min-date enforcement
 *    PassengerPicker      MUI Popover (anchored, outside-click aware) with Adult/Child/Infant counters
 *    CurrencySelect       KWD / USD / EUR dropdown
 *    SearchButton         Gradient CTA, fully themed
 *    MultiCityLegs        Renders up to 5 leg rows using the atoms above
 *
 *  FlightSearchForm       Pure layout composer — receives state + themeConfig, zero hardcoded colours
 *
 *  Designs                Three independent visual skins, each owning only:
 *    Design1 Gulf Midnight   dark navy glass · teal · dot-grid background
 *    Design2 Desert Sand     ivory · terracotta · gold · serif hero
 *    Design3 Clean Air       white · indigo · sky-blue · modern airline
 *
 *  App (default export)   Floating bottom switcher to toggle designs
 *
 * Usage
 * ─────
 *  Drop this file in as src/App.jsx (or import <App /> from it).
 *  Requires: @mui/material  @mui/icons-material  @emotion/react  @emotion/styled
 *
 * ════════════════════════════════════════════════════════════════════════════
 */



import { useState, useCallback } from "react";
import {Box,Typography,TextField,MenuItem,Select,FormControl,InputLabel,IconButton,Button,Popover,Autocomplete,ToggleButtonGroup,ToggleButton, Divider,Grid,Chip,Paper,} from "@mui/material";
import {FlightTakeoff,FlightLand,SwapHoriz,CalendarMonth,Person,ExpandMore,Add,Remove,Search,Delete,AirplanemodeActive,ArrowForward,} from "@mui/icons-material";
import {createTheme,ThemeProvider,} from "@mui/material/styles";

// ══════════════════════════════════════════════════════════════════════════
// FILE 1 of 5 — STATIC DATA  (airports, currencies, constants)
// ══════════════════════════════════════════════════════════════════════════

// ─── Static reference data ────────────────────────────────────────────────────

export const AIRPORTS = [
      { code: "KWI", city: "Kuwait City", country: "Kuwait", name: "Kuwait International Airport" },
      { code: "DXB", city: "Dubai", country: "UAE", name: "Dubai International Airport" },
      { code: "AUH", city: "Abu Dhabi", country: "UAE", name: "Zayed International Airport" },
      { code: "JFK", city: "New York", country: "USA", name: "John F. Kennedy International" },
      { code: "LHR", city: "London", country: "UK", name: "Heathrow Airport" },
      { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle Airport" },
      { code: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport" },
      { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Amsterdam Schiphol" },
      { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt Airport" },
      { code: "BEY", city: "Beirut", country: "Lebanon", name: "Rafic Hariri International" },
      { code: "CAI", city: "Cairo", country: "Egypt", name: "Cairo International Airport" },
      { code: "RUH", city: "Riyadh", country: "Saudi Arabia", name: "King Khalid International" },
      { code: "JED", city: "Jeddah", country: "Saudi Arabia", name: "King Abdulaziz International" },
      { code: "BAH", city: "Bahrain", country: "Bahrain", name: "Bahrain International Airport" },
      { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad International Airport" },
      { code: "MCT", city: "Muscat", country: "Oman", name: "Muscat International Airport" },
];

export const CURRENCIES = [
      { code: "KWD", symbol: "KD", label: "Kuwaiti Dinar" },
      { code: "USD", symbol: "$", label: "US Dollar" },
      { code: "EUR", symbol: "€", label: "Euro" },
];

export const TODAY = new Date().toISOString().split("T")[0];

export const TRIP_TYPES = [
      { value: "oneway", label: "One Way" },
      { value: "round", label: "Round Trip" },
      { value: "multicity", label: "Multi-City" },
];


// ══════════════════════════════════════════════════════════════════════════
// FILE 2 of 5 — STATE HOOK   (useFlightSearch)
// ══════════════════════════════════════════════════════════════════════════


const DEFAULT_PAX = { adults: 1, children: 0, infants: 0 };
const DEFAULT_LEG = () => ({ origin: null, dest: null, date: "" });

export function useFlightSearch() {
      const [tripType, setTripType] = useState("round");
      const [origin, setOrigin] = useState(null);
      const [dest, setDest] = useState(null);
      const [depart, setDepart] = useState("");
      const [returnDate, setReturnDate] = useState("");
      const [pax, setPax] = useState(DEFAULT_PAX);
      const [currency, setCurrency] = useState("KWD");
      const [legs, setLegs] = useState([DEFAULT_LEG(), DEFAULT_LEG()]);

      // ── swap origin ↔ destination ──────────────────────────────────────────────
      const swapAirports = useCallback(() => {
            setOrigin(prev => { setDest(prev); return dest; });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dest]);

      // ── passenger count helpers ───────────────────────────────────────────────
      const updatePax = useCallback((type, delta) => {
            setPax(prev => {
                  const next = { ...prev, [type]: Math.max(0, prev[type] + delta) };
                  if (next.adults < 1) next.adults = 1;
                  if (next.infants > next.adults) next.infants = next.adults;
                  return next;
            });
      }, []);

      const totalPax = pax.adults + pax.children + pax.infants;

      // ── multi-city helpers ────────────────────────────────────────────────────
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

      return {
            tripType, setTripType,
            origin, setOrigin,
            dest, setDest,
            depart, setDepart,
            returnDate, setReturnDate,
            pax, updatePax, totalPax,
            currency, setCurrency,
            legs, addLeg, removeLeg, updateLeg,
            swapAirports,
      };
}


// ══════════════════════════════════════════════════════════════════════════
// FILE 3 of 5 — ATOM COMPONENTS  (TripTypeSelector · AirportField · SwapButton · DateField · PassengerPicker · CurrencySelect · SearchButton · MultiCityLegs)
// ══════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────────────
// Prop shape every atom receives for theming
// {
//   accentColor: string,   // primary CTA / icons
//   secondaryColor: string,// return date / destination icon
//   fieldBg: string,       // input background
//   fieldBorder: string,   // default border color
//   fieldRadius: number,   // border radius in px
//   labelColor: string,    // field label / caption
//   textColor: string,     // primary text
//   subTextColor: string,  // secondary / helper text
// }
// ─────────────────────────────────────────────────────────────────────────────

const fieldSx = (t) => ({
      borderRadius: `${t.fieldRadius}px`,
      backgroundColor: t.fieldBg,
      "& .MuiOutlinedInput-notchedOutline": { borderColor: t.fieldBorder },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.accentColor },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: t.accentColor,
            borderWidth: 2,
      },
});

// ══════════════════════════════════════════════════════════════════════════════
// 1. TripTypeSelector
// ══════════════════════════════════════════════════════════════════════════════
export function TripTypeSelector({ value, onChange, variant = "tabs", themeConfig }) {
      const t = themeConfig;

      // ── variant: "tabs" (underline style) ────────────────────────────────────
      if (variant === "tabs") {
            return (
                  <Box sx={{ display: "flex", borderBottom: `1px solid ${t.fieldBorder}`, mb: 3 }}>
                        {TRIP_TYPES.map(({ value: v, label }) => (
                              <Box
                                    key={v}
                                    onClick={() => onChange(v)}
                                    sx={{
                                          px: 3, py: 1.5, cursor: "pointer", fontSize: 14, fontWeight: 600,
                                          userSelect: "none",
                                          color: value === v ? t.accentColor : t.subTextColor,
                                          borderBottom: value === v
                                                ? `3px solid ${t.accentColor}`
                                                : "3px solid transparent",
                                          transition: "all .18s",
                                          "&:hover": { color: t.accentColor },
                                    }}
                              >
                                    {label}
                              </Box>
                        ))}
                  </Box>
            );
      }

      // ── variant: "pills" (filled chip style) ─────────────────────────────────
      if (variant === "pills") {
            return (
                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                        {TRIP_TYPES.map(({ value: v, label }) => (
                              <Box
                                    key={v}
                                    onClick={() => onChange(v)}
                                    sx={{
                                          px: 2.5, py: .9, borderRadius: 6, cursor: "pointer",
                                          fontSize: 13, fontWeight: 700, userSelect: "none",
                                          bgcolor: value === v ? t.accentColor : "transparent",
                                          color: value === v ? t.pillTextColor || "#fff" : t.subTextColor,
                                          border: `1.5px solid ${value === v ? t.accentColor : t.fieldBorder}`,
                                          transition: "all .18s",
                                          "&:hover": {
                                                bgcolor: value === v ? t.accentColor : t.fieldBg,
                                                borderColor: t.accentColor,
                                          },
                                    }}
                              >
                                    {label}
                              </Box>
                        ))}
                  </Box>
            );
      }

      // ── variant: "bar" (dark strip, used in Design 2) ────────────────────────
      return (
            <Box sx={{ display: "flex", bgcolor: t.barBg || "#111", mb: 0 }}>
                  {TRIP_TYPES.map(({ value: v, label }) => (
                        <Box
                              key={v}
                              onClick={() => onChange(v)}
                              sx={{
                                    px: 3, py: 1.5, cursor: "pointer",
                                    fontSize: 13, fontWeight: 600, userSelect: "none",
                                    color: value === v ? t.accentColor : t.subTextColor,
                                    borderBottom: value === v
                                          ? `3px solid ${t.accentColor}`
                                          : "3px solid transparent",
                                    transition: "all .18s",
                                    "&:hover": { color: t.textColor },
                              }}
                        >
                              {label}
                        </Box>
                  ))}
            </Box>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. AirportField — MUI Autocomplete with airport code badge in dropdown
// ══════════════════════════════════════════════════════════════════════════════
export function AirportField({ value, onChange, label, icon, themeConfig }) {
      const t = themeConfig;
      return (
            <Autocomplete
                  options={AIRPORTS}
                  value={value}
                  onChange={(_, v) => onChange(v)}
                  getOptionLabel={(o) => o ? `${o.city} (${o.code})` : ""}
                  isOptionEqualToValue={(opt, val) => opt.code === val.code}
                  filterOptions={(options, { inputValue }) => {
                        const q = inputValue.toLowerCase();
                        return options.filter(
                              (o) =>
                                    o.city.toLowerCase().includes(q) ||
                                    o.code.toLowerCase().includes(q) ||
                                    o.country.toLowerCase().includes(q) ||
                                    o.name.toLowerCase().includes(q)
                        );
                  }}
                  renderOption={(props, option) => (
                        <Box
                              component="li"
                              {...props}
                              sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2, px: 1.5 }}
                        >
                              {/* Airport code badge */}
                              <Box
                                    sx={{
                                          minWidth: 46, height: 36, borderRadius: 1.5,
                                          bgcolor: `${t.accentColor}18`,
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          flexShrink: 0,
                                    }}
                              >
                                    <Typography
                                          sx={{ color: t.accentColor, fontWeight: 800, fontSize: 12, letterSpacing: .5 }}
                                    >
                                          {option.code}
                                    </Typography>
                              </Box>
                              <Box>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: t.textColor }}>
                                          {option.city}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: t.subTextColor, display: "block" }}>
                                          {option.name} · {option.country}
                                    </Typography>
                              </Box>
                        </Box>
                  )}
                  renderInput={(params) => (
                        <TextField
                              {...params}
                              label={label}
                              placeholder="City or airport code"
                              InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                          <>
                                                {icon}
                                                {params.InputProps.startAdornment}
                                          </>
                                    ),
                                    sx: fieldSx(t),
                              }}
                              InputLabelProps={{ sx: { color: t.labelColor } }}
                        />
                  )}
            />
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. SwapButton
// ══════════════════════════════════════════════════════════════════════════════
export function SwapButton({ onClick, themeConfig }) {
      const t = themeConfig;
      return (
            <IconButton
                  onClick={onClick}
                  size="small"
                  sx={{
                        border: `1.5px solid ${t.fieldBorder}`,
                        color: t.accentColor,
                        bgcolor: t.fieldBg,
                        transition: "all .18s",
                        "&:hover": {
                              bgcolor: `${t.accentColor}18`,
                              borderColor: t.accentColor,
                              transform: "rotate(180deg)",
                        },
                  }}
            >
                  <SwapHoriz fontSize="small" />
            </IconButton>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. DateField
// ══════════════════════════════════════════════════════════════════════════════
export function DateField({ label, value, onChange, min, iconColor, themeConfig }) {
      const t = themeConfig;
      return (
            <TextField
                  fullWidth
                  label={label}
                  type="date"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  inputProps={{ min: min || TODAY }}
                  InputLabelProps={{ shrink: true, sx: { color: t.labelColor } }}
                  InputProps={{
                        startAdornment: (
                              <CalendarMonth
                                    sx={{ color: iconColor || t.accentColor, mr: 0.75, fontSize: 18 }}
                              />
                        ),
                        sx: fieldSx(t),
                  }}
            />
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. PassengerPicker — trigger + MUI Popover
// ══════════════════════════════════════════════════════════════════════════════
const PAX_ROWS = [
      { key: "adults", label: "Adults", note: "Age 12+" },
      { key: "children", label: "Children", note: "Age 2–11" },
      { key: "infants", label: "Infants", note: "Under 2" },
];

export function PassengerPicker({ pax, totalPax, updatePax, themeConfig }) {
      const t = themeConfig;
      const [anchor, setAnchor] = useState(null);
      const open = Boolean(anchor);

      const handleOpen = useCallback((e) => setAnchor(e.currentTarget), []);
      const handleClose = useCallback(() => setAnchor(null), []);

      return (
            <>
                  {/* Trigger field */}
                  <TextField
                        fullWidth
                        label="Passengers"
                        value={`${totalPax} ${totalPax === 1 ? "Passenger" : "Passengers"}`}
                        onClick={handleOpen}
                        InputProps={{
                              readOnly: true,
                              startAdornment: (
                                    <Person sx={{ color: t.accentColor, mr: 0.75, fontSize: 18 }} />
                              ),
                              endAdornment: (
                                    <ExpandMore
                                          sx={{
                                                color: t.subTextColor, fontSize: 20,
                                                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform .2s",
                                          }}
                                    />
                              ),
                              sx: { ...fieldSx(t), cursor: "pointer" },
                        }}
                        InputLabelProps={{ sx: { color: t.labelColor } }}
                        sx={{ cursor: "pointer", "& input": { cursor: "pointer" } }}
                  />

                  {/* MUI Popover — properly anchored, outside-click aware */}
                  <Popover
                        open={open}
                        anchorEl={anchor}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                        PaperProps={{
                              elevation: 12,
                              sx: {
                                    mt: 1, p: 2.5, minWidth: 260, borderRadius: 2,
                                    border: `1px solid ${t.fieldBorder}`,
                                    bgcolor: t.popoverBg || "#fff",
                              },
                        }}
                  >
                        {PAX_ROWS.map(({ key, label, note }, idx) => (
                              <Box key={key}>
                                    <Box
                                          sx={{
                                                display: "flex", alignItems: "center",
                                                justifyContent: "space-between", py: 1.4,
                                          }}
                                    >
                                          <Box>
                                                <Typography
                                                      variant="body2"
                                                      fontWeight={700}
                                                      sx={{ color: t.textColor }}
                                                >
                                                      {label}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: t.subTextColor }}>
                                                      {note}
                                                </Typography>
                                          </Box>

                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                                <IconButton
                                                      size="small"
                                                      onClick={() => updatePax(key, -1)}
                                                      sx={{
                                                            width: 30, height: 30,
                                                            border: `1.5px solid ${t.fieldBorder}`,
                                                            color: t.accentColor,
                                                            "&:hover": { bgcolor: `${t.accentColor}14`, borderColor: t.accentColor },
                                                      }}
                                                >
                                                      <Remove sx={{ fontSize: 14 }} />
                                                </IconButton>

                                                <Typography
                                                      fontWeight={800}
                                                      sx={{ minWidth: 24, textAlign: "center", color: t.textColor }}
                                                >
                                                      {pax[key]}
                                                </Typography>

                                                <IconButton
                                                      size="small"
                                                      onClick={() => updatePax(key, 1)}
                                                      sx={{
                                                            width: 30, height: 30,
                                                            bgcolor: `${t.accentColor}18`,
                                                            color: t.accentColor,
                                                            "&:hover": { bgcolor: `${t.accentColor}30` },
                                                      }}
                                                >
                                                      <Add sx={{ fontSize: 14 }} />
                                                </IconButton>
                                          </Box>
                                    </Box>
                                    {idx < PAX_ROWS.length - 1 && (
                                          <Divider sx={{ borderColor: t.fieldBorder }} />
                                    )}
                              </Box>
                        ))}

                        <Button
                              fullWidth
                              variant="contained"
                              onClick={handleClose}
                              sx={{
                                    mt: 2, borderRadius: 1.5,
                                    bgcolor: t.accentColor,
                                    "&:hover": { bgcolor: t.accentHover || t.accentColor },
                                    color: t.ctaTextColor || "#fff",
                                    fontWeight: 700, textTransform: "none",
                              }}
                        >
                              Done
                        </Button>
                  </Popover>
            </>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. CurrencySelect
// ══════════════════════════════════════════════════════════════════════════════
export function CurrencySelect({ value, onChange, themeConfig }) {
      const t = themeConfig;
      return (
            <FormControl fullWidth>
                  <InputLabel sx={{ color: t.labelColor }}>Currency</InputLabel>
                  <Select
                        value={value}
                        label="Currency"
                        onChange={(e) => onChange(e.target.value)}
                        sx={{
                              borderRadius: `${t.fieldRadius}px`,
                              bgcolor: t.fieldBg,
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: t.fieldBorder },
                              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.accentColor },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: t.accentColor, borderWidth: 2,
                              },
                        }}
                  >
                        {CURRENCIES.map((c) => (
                              <MenuItem key={c.code} value={c.code}>
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                          <Typography fontWeight={700} sx={{ color: t.accentColor, minWidth: 24 }}>
                                                {c.symbol}
                                          </Typography>
                                          <Typography variant="body2">{c.code}</Typography>
                                    </Box>
                              </MenuItem>
                        ))}
                  </Select>
            </FormControl>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. SearchButton
// ══════════════════════════════════════════════════════════════════════════════
export function SearchButton({ onClick, fullWidth = true, themeConfig }) {
      const t = themeConfig;
      return (
            <Button
                  fullWidth={fullWidth}
                  variant="contained"
                  size="large"
                  onClick={onClick}
                  sx={{
                        height: 56,
                        borderRadius: `${t.fieldRadius}px`,
                        background: t.ctaGradient || t.accentColor,
                        color: t.ctaTextColor || "#fff",
                        fontWeight: 800,
                        fontSize: 15,
                        textTransform: "none",
                        letterSpacing: .3,
                        boxShadow: t.ctaShadow || "none",
                        "&:hover": {
                              background: t.ctaGradientHover || t.accentHover || t.accentColor,
                              boxShadow: t.ctaShadowHover || "none",
                        },
                  }}
            >
                  <Search sx={{ mr: 1, fontSize: 20 }} />
                  Search Flights
            </Button>
      );
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. MultiCityLegs
// ══════════════════════════════════════════════════════════════════════════════
export function MultiCityLegs({ legs, updateLeg, addLeg, removeLeg, themeConfig }) {
      const t = themeConfig;
      return (
            <Box>
                  {legs.map((leg, i) => (
                        <Box
                              key={i}
                              sx={{
                                    mb: 2, p: 2.5,
                                    border: `1px solid ${t.fieldBorder}`,
                                    borderRadius: `${t.fieldRadius}px`,
                                    bgcolor: t.legBg || "transparent",
                                    position: "relative",
                              }}
                        >
                              {/* Leg header */}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                    <Box
                                          sx={{
                                                width: 26, height: 26, borderRadius: "50%",
                                                bgcolor: `${t.accentColor}18`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                          }}
                                    >
                                          <Typography sx={{ color: t.accentColor, fontWeight: 800, fontSize: 12 }}>
                                                {i + 1}
                                          </Typography>
                                    </Box>
                                    <Typography
                                          variant="caption"
                                          sx={{
                                                color: t.accentColor, fontWeight: 700,
                                                textTransform: "uppercase", letterSpacing: 1.2,
                                          }}
                                    >
                                          Flight {i + 1}
                                    </Typography>

                                    {/* Remove leg */}
                                    {legs.length > 2 && (
                                          <IconButton
                                                size="small"
                                                onClick={() => removeLeg(i)}
                                                sx={{
                                                      ml: "auto", color: t.subTextColor,
                                                      "&:hover": { color: "#ef4444" },
                                                }}
                                          >
                                                <Delete sx={{ fontSize: 16 }} />
                                          </IconButton>
                                    )}
                              </Box>

                              {/* Fields row */}
                              <Box
                                    sx={{
                                          display: "grid",
                                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                                          gap: 2,
                                    }}
                              >
                                    <AirportField
                                          value={leg.origin}
                                          onChange={(v) => updateLeg(i, "origin", v)}
                                          label="From"
                                          icon={<FlightTakeoff sx={{ color: t.accentColor, mr: 0.75, fontSize: 18 }} />}
                                          themeConfig={t}
                                    />
                                    <AirportField
                                          value={leg.dest}
                                          onChange={(v) => updateLeg(i, "dest", v)}
                                          label="To"
                                          icon={<FlightLand sx={{ color: t.secondaryColor, mr: 0.75, fontSize: 18 }} />}
                                          themeConfig={t}
                                    />
                                    <DateField
                                          label="Departure Date"
                                          value={leg.date}
                                          onChange={(v) => updateLeg(i, "date", v)}
                                          themeConfig={t}
                                    />
                              </Box>
                        </Box>
                  ))}

                  {/* Add flight CTA */}
                  {legs.length < 5 && (
                        <Button
                              variant="outlined"
                              startIcon={<Add />}
                              onClick={addLeg}
                              sx={{
                                    mt: 1,
                                    borderRadius: `${t.fieldRadius}px`,
                                    color: t.accentColor,
                                    borderColor: t.accentColor,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    "&:hover": { bgcolor: `${t.accentColor}10` },
                              }}
                        >
                              Add Another Flight
                        </Button>
                  )}
            </Box>
      );
}


// ══════════════════════════════════════════════════════════════════════════
// FILE 4 of 5 — COMPOSER  (FlightSearchForm — pure layout, zero colours)
// ══════════════════════════════════════════════════════════════════════════


/**
 * FlightSearchForm
 * ─────────────────
 * Pure layout composer. Receives:
 *   - all state from useFlightSearch()
 *   - themeConfig  object (color + radius tokens)
 *   - selectorVariant  "tabs" | "pills" | "bar"
 *
 * Contains zero colour values — 100% driven by themeConfig.
 */
export function FlightSearchForm({
      // state
      tripType, setTripType,
      origin, setOrigin,
      dest, setDest,
      depart, setDepart,
      returnDate, setReturnDate,
      pax, updatePax, totalPax,
      currency, setCurrency,
      legs, addLeg, removeLeg, updateLeg,
      swapAirports,
      // theme
      themeConfig,
      selectorVariant = "tabs",
}) {
      const t = themeConfig;
      const isRound = tripType === "round";
      const isMulti = tripType === "multicity";

      return (
            <Box>
                  {/* ── Trip type selector ─────────────────────────────────────────── */}
                  <TripTypeSelector
                        value={tripType}
                        onChange={setTripType}
                        variant={selectorVariant}
                        themeConfig={t}
                  />

                  {/* ── One-way / Round-trip layout ────────────────────────────────── */}
                  {!isMulti && (
                        <Grid container spacing={2} alignItems="center">

                              {/* From */}
                              <Grid item xs={12} md={isRound ? 2.7 : 3.2}>
                                    <AirportField
                                          value={origin}
                                          onChange={setOrigin}
                                          label="From"
                                          icon={<FlightTakeoff sx={{ color: t.accentColor, mr: 0.75, fontSize: 18 }} />}
                                          themeConfig={t}
                                    />
                              </Grid>

                              {/* Swap */}
                              <Grid
                                    item xs={12} md={0.5}
                                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                    <SwapButton onClick={swapAirports} themeConfig={t} />
                              </Grid>

                              {/* To */}
                              <Grid item xs={12} md={isRound ? 2.7 : 3.2}>
                                    <AirportField
                                          value={dest}
                                          onChange={setDest}
                                          label="To"
                                          icon={<FlightLand sx={{ color: t.secondaryColor, mr: 0.75, fontSize: 18 }} />}
                                          themeConfig={t}
                                    />
                              </Grid>

                              {/* Depart */}
                              <Grid item xs={12} md={isRound ? 1.7 : 2.2}>
                                    <DateField
                                          label="Depart"
                                          value={depart}
                                          onChange={setDepart}
                                          min={TODAY}
                                          iconColor={t.accentColor}
                                          themeConfig={t}
                                    />
                              </Grid>

                              {/* Return — only for round trip */}
                              {isRound && (
                                    <Grid item xs={12} md={1.7}>
                                          <DateField
                                                label="Return"
                                                value={returnDate}
                                                onChange={setReturnDate}
                                                min={depart || TODAY}
                                                iconColor={t.secondaryColor}
                                                themeConfig={t}
                                          />
                                    </Grid>
                              )}

                              {/* Passengers */}
                              <Grid item xs={12} md={1.6}>
                                    <PassengerPicker
                                          pax={pax}
                                          totalPax={totalPax}
                                          updatePax={updatePax}
                                          themeConfig={t}
                                    />
                              </Grid>

                              {/* Currency */}
                              <Grid item xs={12} md={1.1}>
                                    <CurrencySelect
                                          value={currency}
                                          onChange={setCurrency}
                                          themeConfig={t}
                                    />
                              </Grid>

                              {/* Search */}
                              <Grid item xs={12} md={1.7}>
                                    <SearchButton themeConfig={t} />
                              </Grid>
                        </Grid>
                  )}

                  {/* ── Multi-city layout ──────────────────────────────────────────── */}
                  {isMulti && (
                        <>
                              <MultiCityLegs
                                    legs={legs}
                                    updateLeg={updateLeg}
                                    addLeg={addLeg}
                                    removeLeg={removeLeg}
                                    themeConfig={t}
                              />

                              {/* Bottom row: currency + search */}
                              <Grid container spacing={2} sx={{ mt: 1 }} alignItems="center">
                                    <Grid item xs={12} md={2}>
                                          <CurrencySelect value={currency} onChange={setCurrency} themeConfig={t} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                          <SearchButton themeConfig={t} />
                                    </Grid>
                              </Grid>
                        </>
                  )}
            </Box>
      );
}


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
                                                <Grid item xs={12} md={3} key={route}>
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
                              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-.4px" }}>AirKuwait</Typography>
                              <Box
                                    sx={{
                                          ml: 1, px: 1.5, py: .3, borderRadius: 1,
                                          bgcolor: "rgba(255,255,255,0.12)",
                                    }}
                              >
                                    <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600 }}>BETA</Typography>
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
                                          <Grid item xs={6} md={3} key={lbl}>
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
                                                <Grid item xs={6} md={3} key={d.city}>
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

export default function App() {
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
                              backdropFilter: "blur(16px)", bgcolor: "rgba(0,0,0,.70)",
                              borderRadius: 10, px: 1.5, py: 1,
                              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                              border: "1px solid rgba(255,255,255,.1)",
                        }}
                  >
                        <Typography sx={{ color: "rgba(255,255,255,.4)", fontSize: 11, fontWeight: 600, pr: .5, letterSpacing: .5 }}>
                              DESIGN
                        </Typography>
                        {DESIGNS.map(d => (
                              <Button
                                    key={d.id}
                                    size="small"
                                    onClick={() => setActive(d.id)}
                                    sx={{
                                          minWidth: 0, px: 1.8, py: .5, borderRadius: 8,
                                          fontSize: 12, fontWeight: 700,
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