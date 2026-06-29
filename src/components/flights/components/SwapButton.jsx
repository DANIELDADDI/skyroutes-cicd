import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";


// ══════════════════════════════════════════════════════════════════════════════
// 3. SwapButton
// ══════════════════════════════════════════════════════════════════════════════
export default function SwapButton({ onClick, themeConfig }) {
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
