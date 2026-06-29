import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import  AirportField  from "./AirportField";
import PassengerPicker from "./PassengerPicker";
import TripTypeSelector from "./TripTypeSelector.jsx";
import DateField from './DateField';
import SwapButton from './SwapButton';  
import PassegerPicker from './PassengerPicker';
import  CurrencySelect  from "./CurrencySelect";
import SearchButton from "./SearchButton.jsx";
import { AIRPORTS, CURRENCIES, TODAY, TRIP_TYPES } from "../dataStatic/data.js";


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
export default function FlightSearchForm({
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

      const [dateError, setDateError] = useState("");
      const t = themeConfig;
      const isRound = tripType === "round";
      const isMulti = tripType === "multicity";

      const handleSearch = () => {
            const errors = [];

            if (!origin) errors.push("Please select a departure airport.");
            if (!dest) errors.push("Please select a destination airport.");
            if (!depart) errors.push("Please select a departure date.");
            if (tripType === "round" && !returnDate)
                  errors.push("Please select a return date.");
            if (tripType === "round" && returnDate && returnDate <= depart)
                  errors.push("Return date must be after departure date.");
            if (totalPax > 9) errors.push("Maximum 9 passengers allowed.");

            if (errors.length > 0) {
                  setFormError(errors[0]); // show the first blocking error
                  return;
            }

            setFormError("");
            // proceed with search — call your API or navigate
            console.log("Search submitted ✅", {
                  tripType, origin, dest, depart, returnDate, pax, currency
            });
      };

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
                              <Grid size={{ xs: 12, md: isRound ? 3.2 : 3.2 }} >
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
                                    size={{ xs: 12, md: 0.5 }}
                                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                    <SwapButton onClick={swapAirports} themeConfig={t} />
                              </Grid>

                              {/* To */}
                              <Grid size={{ xs: 12, md: isRound ? 3.2 : 3.2 }}>
                                    <AirportField
                                          value={dest}
                                          onChange={setDest}
                                          label="To"
                                          icon={<FlightLand sx={{ color: t.secondaryColor, mr: 0.75, fontSize: 18 }} />}
                                          themeConfig={t}
                                    />
                              </Grid>



                              {/* Depart */}
                              <Grid size={{ xs: 12, md: isRound ? 2.2 : 2.2 }} >
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
                                    <Grid size={{ xs: 12, md: 2.2 }} >
                                          <DateField
                                                label="Return"
                                                value={returnDate}
                                                onChange={(v) => {
                                                      if (depart && v <= depart) {
                                                            setDateError("Return date must be after departure date.");
                                                      } else {
                                                            setDateError("");
                                                            setReturnDate(v);
                                                      }
                                                }}
                                                min={depart || TODAY}
                                                iconColor={t.secondaryColor}
                                                themeConfig={t}
                                          />

                                          {dateError && (
                                                <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                                                      <Typography variant="caption" sx={{ color: "#DC2626", fontWeight: 600 }}>
                                                            ⚠ {dateError}
                                                      </Typography>
                                                </Box>
                                          )}
                                    </Grid>
                              )}


                              {/* Passengers */}
                              <Grid size={{ xs: 12, md: 2.2 }} >
                                    <PassengerPicker
                                          pax={pax}
                                          totalPax={totalPax}
                                          updatePax={updatePax}
                                          themeConfig={t}
                                    />
                              </Grid>

                              {/* Currency */}
                              <Grid size={{ xs: 12, md: 2.2 }} >
                                    <CurrencySelect
                                          value={currency}
                                          onChange={setCurrency}
                                          themeConfig={t}
                                    />
                              </Grid>


                              {/* Search */}
                              <Grid size={{ xs: 12, md: 3.2 }} >
                                    <SearchButton
                                          onClick={handleSearch}
                                          themeConfig={t}
                                          disabled={!!dateError}
                                          sx={{ opacity: dateError ? 0.5 : 1 }}
                                    />
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
                                    <Grid size={{ xs: 12, md: 2 }} >
                                          <CurrencySelect value={currency} onChange={setCurrency} themeConfig={t} />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }} >
                                          <SearchButton
                                                themeConfig={t}
                                                onClick={handleSearch}
                                                themeConfig={t}
                                                disabled={!!dateError}
                                                sx={{ opacity: dateError ? 0.5 : 1 }}
                                          />
                                    </Grid>
                              </Grid>
                        </>
                  )}
            </Box>
      );
}