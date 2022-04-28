import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    // Tell MUI what's the font-size on the html element is.
    htmlFontSize: 10,
  },
  mixins: {
    toolbar: {
      minHeight: 56,
    },
  },
});
