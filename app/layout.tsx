import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import { Box, CssBaseline, Container } from "@mui/material";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Users Management - NextJS App",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers>
          <CssBaseline />
          {session ? (
            <Box sx={{ display: "flex" }}>
              {/* <Sidebar /> */}
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Navbar />
                <Container maxWidth="md" sx={{ mt: 4 }}>
                  {children}
                </Container>
              </Box>
            </Box>
          ) : (
            <Container maxWidth="md" sx={{ mt: 4 }}>
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Navbar />
              </Box>
              {children}
            </Container>
          )}
        </Providers>
      </body>
    </html>
  );
}
