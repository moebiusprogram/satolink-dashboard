import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { ThemeProvider as ShadcnThemeProvider } from "@/components/ui/theme-provider";
import Router from "./routes.tsx";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/login" element={<Login />} />
//     </Routes>
//   );
// }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ShadcnThemeProvider defaultTheme={"dark"}>{children}</ShadcnThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </StrictMode>
);
