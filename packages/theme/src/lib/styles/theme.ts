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
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '1px solid #eaeef3',
          '&:hover': {
            border: '1px solid #949db1',
            backgroundColor: 'inherit',
          },
        },
      },
    },
  },
});
