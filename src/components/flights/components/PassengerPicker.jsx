import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import { fieldSx } from "../utils/fieldSx.js";


// ══════════════════════════════════════════════════════════════════════════════
// 5. PassengerPicker — trigger + MUI Popover
// ══════════════════════════════════════════════════════════════════════════════
const PAX_ROWS = [
      { key: "adults", label: "Adults", note: "Age 12+" },
      { key: "children", label: "Children", note: "Age 2–11" },
      { key: "infants", label: "Infants", note: "Under 2" },
];



export default function PassengerPicker({ pax, totalPax, updatePax, themeConfig }) {
      const t = themeConfig;
      const [anchor, setAnchor] = useState(null);
      const open = Boolean(anchor);
      const [paxError, setPaxError] = useState("");



      const MAX_TOTAL = 9;
      const MAX_CHILDREN = 3;
      const MAX_INFANTS = 1;

      // Call this instead of updatePax directly
      const handleAdd = (key) => {
            if (totalPax >= MAX_TOTAL) {
                  setPaxError("Maximum 9 passengers allowed per booking.");
                  return;
            }
            if (key === "children" && pax.children >= MAX_CHILDREN) {
                  setPaxError("Maximum 3 children allowed per booking.");
                  return;
            }
            if (key === "infants" && pax.infants >= MAX_INFANTS) {
                  setPaxError("Maximum 1 infant allowed per booking.");
                  return;
            }
            if (key === "infants" && pax.infants >= pax.adults) {
                  setPaxError("Number of infants cannot exceed number of adults.");
                  return;
            }
            setPaxError(""); // clear error on valid action
            updatePax(key, 1);
      };

      const handleRemove = (key) => {
            setPaxError(""); // clear error on remove
            updatePax(key, -1);
      };


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
                                                      // onClick={() => updatePax(key, -1)}
                                                      onClick={() => handleRemove(key)}
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
                                                      // onClick={() => updatePax(key, 1)}
                                                      onClick={() => handleAdd(key)}
                                                      disabled={totalPax >= MAX_TOTAL || pax.infants >= MAX_INFANTS || pax.infants >= pax.adults}
                                                      sx={{
                                                            width: 30, height: 30,
                                                            bgcolor: totalPax >= MAX_TOTAL ? "#F3F4F6" : `${t.accentColor}18`,
                                                            color: totalPax >= MAX_TOTAL ? "#9CA3AF" : t.accentColor,
                                                            "&:hover": { bgcolor: `${t.accentColor}30` },
                                                            "&.Mui-disabled": { bgcolor: "#F3F4F6", color: "#D1D5DB" },
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

                        {paxError && (
                              <Box sx={{
                                    mt: 1.5, px: 1.5, py: 1,
                                    bgcolor: "#FEF2F2",
                                    border: "1px solid #FECACA",
                                    borderRadius: 1.5,
                              }}>
                                    <Typography variant="caption" sx={{ color: "#DC2626", fontWeight: 600 }}>
                                          ⚠ {paxError}
                                    </Typography>
                              </Box>
                        )}

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