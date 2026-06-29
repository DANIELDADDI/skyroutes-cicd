import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";




// ══════════════════════════════════════════════════════════════════════════════
// 8. MultiCityLegs
// ══════════════════════════════════════════════════════════════════════════════
export default function MultiCityLegs({ legs, updateLeg, addLeg, removeLeg, themeConfig }) {
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
