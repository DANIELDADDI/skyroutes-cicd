import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import { AIRPORTS, CURRENCIES, TODAY, TRIP_TYPES } from "../dataStatic/data.js";
import { fieldSx } from "../utils/fieldSx.js";




// ══════════════════════════════════════════════════════════════════════════════
// 6. CurrencySelect
// ══════════════════════════════════════════════════════════════════════════════
export default function CurrencySelect({ value, onChange, themeConfig }) {
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
