import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import { AIRPORTS, CURRENCIES, TODAY, TRIP_TYPES } from "../dataStatic/data.js";
import { fieldSx } from "../utils/fieldSx.js";


// ══════════════════════════════════════════════════════════════════════════════
// 4. DateField
// ══════════════════════════════════════════════════════════════════════════════



export default function DateField({ label, value, onChange, min, iconColor, themeConfig }) {
      const t = themeConfig;
      return (
            <TextField
                  fullWidth
                  label={label}
                  type="date"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  inputProps={{ min: min || TODAY }}
                  slotProps={{
                        inputLabel: { shrink: true },
                        sx: {
                              color: t.labelColor,
                              fontSize: 12,
                              letterSpacing: 0.5,
                        },
                  }}

                  InputProps={{
                        notched: true,
                        startAdornment: (
                              <CalendarMonth
                                    sx={{ color: iconColor || t.accentColor, mr: 0.75, fontSize: 18 }}
                              />
                        ),
                        sx: {
                              ...fieldSx(t),
                              "& input::-webkit-datetime-edit": {
                                    color: value ? t.textColor : "transparent",
                              },
                              "& input:focus::-webkit-datetime-edit": {
                                    color: t.textColor,
                              },
                        },
                  }}
            />
      );
}