import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { router } from './routes';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { LanguageProvider } from './i18n/LanguageContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LanguageProvider>
          <GlobalStyles />
          <RouterProvider router={router} />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
