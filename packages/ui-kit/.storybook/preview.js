import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import { theme } from '@finex/theme';

import '../../theme/src/lib/styles/global.scss';

export const decorators = [
  Story => (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Story />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  ),
];
