// import { useState, useCallback } from "react";
// import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
// import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
// import { createTheme, ThemeProvider, } from "@mui/material/styles";
// import { AIRPORTS, CURRENCIES, TODAY, TRIP_TYPES } from "../dataStatic/data.js";
// import { fieldSx } from "../utils/fieldSx.js";
// // ══════════════════════════════════════════════════════════════════════════════
// // 2. AirportField — MUI Autocomplete with airport code badge in dropdown
// // ══════════════════════════════════════════════════════════════════════════════




// export default function AirportField({ value, onChange, label, icon, themeConfig }) {
//       const t = themeConfig;
//       return (
//             <Autocomplete
//                   options={AIRPORTS}
//                   value={value}
//                   onChange={(_, v) => onChange(v)}
//                   getOptionLabel={(o) => o ? `${o.city} (${o.code})` : ""}
//                   isOptionEqualToValue={(opt, val) => opt.code === val.code}
//                   filterOptions={(options, { inputValue }) => {
//                         const q = inputValue.toLowerCase();
//                         return options.filter(
//                               (o) =>
//                                     o.city.toLowerCase().includes(q) ||
//                                     o.code.toLowerCase().includes(q) ||
//                                     o.country.toLowerCase().includes(q) ||
//                                     o.name.toLowerCase().includes(q)
//                         );
//                   }}
//                   renderOption={(props, option) => (
//                         <Box
//                               component="li"
//                               {...props}
//                               sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2, px: 1.5 }}
//                         >
//                               {/* Airport code badge */}
//                               <Box
//                                     sx={{
//                                           minWidth: 46, height: 36, borderRadius: 1.5,
//                                           bgcolor: `${t.accentColor}18`,
//                                           display: "flex", alignItems: "center", justifyContent: "center",
//                                           flexShrink: 0,
//                                     }}
//                               >
//                                     <Typography
//                                           sx={{ color: t.accentColor, fontWeight: 800, fontSize: 12, letterSpacing: .5 }}
//                                     >
//                                           {option.code}
//                                     </Typography>
//                               </Box>
//                               <Box>
//                                     <Typography variant="body2" fontWeight={700} sx={{ color: t.textColor }}>
//                                           {option.city}
//                                     </Typography>
//                                     <Typography variant="caption" sx={{ color: t.subTextColor, display: "block" }}>
//                                           {option.name} · {option.country}
//                                     </Typography>
//                               </Box>
//                         </Box>
//                   )}
//                   // renderInput={(params) => (
//                   //       <TextField
//                   //             {...params}
//                   //             label={label}
//                   //             placeholder="City or airport code"
//                   //             InputProps={{
//                   //                   ...params.InputProps,
//                   //                   startAdornment: (
//                   //                         <>
//                   //                               {icon}
//                   //                               {params.InputProps.startAdornment}
//                   //                         </>
//                   //                   ),
//                   //                   sx: fieldSx(t),
//                   //             }}
//                   //             InputLabelProps={{ sx: { color: t.labelColor } }}
//                   //       />
//                   // )}

//                   renderInput={(params) => (
//                         <TextField
//                               {...params}
//                               label={label}
//                               placeholder="City or airport code"
//                               InputProps={{
//                                     ...params.slotProps?.input, //  Changed from params.InputProps
//                                     startAdornment: (
//                                           <>
//                                                 {icon}
//                                                 {params.slotProps?.input?.startAdornment} {/*  Changed from params.InputProps */}
//                                           </>
//                                     ),
//                                     sx: fieldSx(t),
//                               }}
//                               InputLabelProps={{ sx: { color: t.labelColor } }}
//                         />
//                   )}

//             />
//       );
// }




// 003_PROJECT/vite-project/src/components/flights/components/AirportField.jsx

import { useState, useCallback } from "react";
import { Autocomplete, TextField, Box, Typography, CircularProgress } from "@mui/material";
import { FlightTakeoff } from "@mui/icons-material";
import axios from "axios";

// ── fieldSx helper (inline — or import from your utils/fieldSx.js) ───────────
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

// ── Debounce helper ──────────────────────────────────────────────────────────
let debounceTimer = null;
const debounce = (fn, delay = 400) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fn, delay);
};

// ── Component ────────────────────────────────────────────────────────────────
export default function AirportField({
      value,
      onChange,
      label,
      icon,
      themeConfig,
      placeholder = "City or airport code",
}) {
      const t = themeConfig;

      const [options, setOptions] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const [inputValue, setInputValue] = useState("");

      // ── Fetch from your Express backend ────────────────────────────────────────
      const fetchAirports = useCallback(async (query) => {
            if (!query || query.length < 2) {
                  setOptions([]);
                  return;
            }

            setLoading(true);
            setError("");

            try {
                  const { data } = await axios.get("http://localhost:5000/api/flights/airports", {
                        params: { q: query },
                  });

                  if (data.success) {
                        setOptions(data.data);
                  } else {
                        setError(data.message || "No airports found.");
                        setOptions([]);
                  }
            } catch (err) {
                  const msg =
                        err.response?.data?.message ||
                        "Could not reach airport search. Check your connection.";
                  setError(msg);
                  setOptions([]);
            } finally {
                  setLoading(false);
            }
      }, []);

      // ── Input change handler with debounce ──────────────────────────────────────
      const handleInputChange = (_, newValue) => {
            setInputValue(newValue);
            setError("");
            debounce(() => fetchAirports(newValue), 400);
      };

      return (
            <Autocomplete
                  options={options}
                  value={value}
                  inputValue={inputValue}
                  onChange={(_, selected) => {
                        onChange(selected);
                        // Populate input box with city name after selection
                        setInputValue(selected ? `${selected.city} (${selected.code})` : "");
                  }}
                  onInputChange={handleInputChange}
                  getOptionLabel={(o) => (o ? `${o.city} (${o.code})` : "")}
                  isOptionEqualToValue={(opt, val) => opt.code === val?.code}
                  filterOptions={(x) => x}        // disable client-side filter — server handles it
                  loading={loading}
                  noOptionsText={
                        inputValue.length < 2
                              ? "Type at least 2 characters..."
                              : error
                                    ? error
                                    : "No airports found."
                  }
                  renderOption={(props, option) => (
                        <Box
                              component="li"
                              {...props}
                              key={option.id}
                              sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.2, px: 1.5 }}
                        >
                              {/* IATA code badge */}
                              <Box
                                    sx={{
                                          minWidth: 46,
                                          height: 36,
                                          borderRadius: 1.5,
                                          bgcolor: `${t.accentColor}18`,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          flexShrink: 0,
                                    }}
                              >
                                    <Typography sx={{ color: t.accentColor, fontWeight: 800, fontSize: 12 }}>
                                          {option.code}
                                    </Typography>
                              </Box>

                              <Box>
                                    <Typography variant="body2" fontWeight={700}>
                                          {option.name} . {option.subType}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                          {option.City} · {option.country}
                                    </Typography>
                              </Box>
                        </Box>
                  )}
                  renderInput={(params) => (
                        <TextField
                              {...params}
                              label={label}
                              placeholder={placeholder}
                              error={!!error}
                              helperText={error || ""}
                              // InputProps={{
                              //       ...params.InputProps,
                              //       startAdornment: (
                              //             <>
                              //                   {icon || (
                              //                         <FlightTakeoff
                              //                               sx={{ color: t.accentColor, mr: 0.75, fontSize: 18 }}
                              //                         />
                              //                   )}
                              //                   {params.InputProps.startAdornment}
                              //             </>
                              //       ),
                              //       endAdornment: (
                              //             <>
                              //                   {loading ? (
                              //                         <CircularProgress size={16} sx={{ color: t.accentColor }} />
                              //                   ) : null}
                              //                   {params.InputProps.endAdornment}
                              //             </>
                              //       ),
                              //       sx: fieldSx(t),
                              // }}
                              // InputLabelProps={{ sx: { color: t.labelColor } }}
                              renderInput={(params) => (
                                    <TextField
                                          {...params}
                                          label={label}
                                          placeholder="City or airport code"
                                          InputProps={{
                                                ...params.slotProps?.input, //  Changed from params.InputProps
                                                startAdornment: (
                                                      <>
                                                            {icon}
                                                            {params.slotProps?.input?.startAdornment} {/*  Changed from params.InputProps */}
                                                      </>
                                                ),
                                                sx: fieldSx(t),
                                          }}
                                          InputLabelProps={{ sx: { color: t.labelColor } }}
                                    />
                              )}
                        />
                  )}
            />
      );
}

