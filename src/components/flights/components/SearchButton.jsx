
import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";



// ══════════════════════════════════════════════════════════════════════════════
// 7. SearchButton
// ══════════════════════════════════════════════════════════════════════════════
export default function SearchButton({ onClick, fullWidth = true, themeConfig }) {
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
