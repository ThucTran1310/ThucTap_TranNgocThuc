import Router from '@/routes/index.jsx';

//provider
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/index.jsx';

//config
import { queryClient } from '@/configs/query.js';

// ----------------------------------------------------------------------

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
