// flights/utils/fieldSx.js
export const fieldSx = (t) => ({
      borderRadius: `${t.fieldRadius}px`,
      backgroundColor: t.fieldBg,
      "& .MuiOutlinedInput-notchedOutline": { borderColor: t.fieldBorder },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.accentColor },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: t.accentColor,
            borderWidth: 2,
      },
});