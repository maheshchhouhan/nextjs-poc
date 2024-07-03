'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, CssBaseline, Container } from '@mui/material';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      window.location.href = '/login';
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return session ? (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  ) : (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {children}
    </Container>
  );
}

export default ClientLayout;
