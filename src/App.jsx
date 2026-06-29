import { useState, useCallback } from "react";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Button, Popover, Autocomplete, ToggleButtonGroup, ToggleButton, Divider, Grid, Chip, Paper, } from "@mui/material";
import { FlightTakeoff, FlightLand, SwapHoriz, CalendarMonth, Person, ExpandMore, Add, Remove, Search, Delete, AirplanemodeActive, ArrowForward, } from "@mui/icons-material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import FlightSearch from "./components/flights/FlightSearch";
import FlightList, { FlightListPreview } from "./components/flights/FlightList";

export default function App() {
     
      return (
            <>
                  <FlightSearch/>
                  {/* <FlightList/>
                  <FlightListPreview/> */}
            </>
      );
}