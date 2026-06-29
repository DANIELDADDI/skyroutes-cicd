import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import { AIRPORTS, CURRENCIES, TODAY, TRIP_TYPES } from "../dataStatic/data.js";

// ══════════════════════════════════════════════════════════════════════════════
// 1. TripTypeSelector
// ══════════════════════════════════════════════════════════════════════════════
export default function TripTypeSelector({ value, onChange, variant = "tabs", themeConfig }) {
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
