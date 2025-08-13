import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { Home } from "./screens/Desktop/Home";
import { Contribua } from "./screens/Desktop/Contribua";
import { Sobre } from "./screens/Desktop/Sobre";
import { Contato } from "./screens/Desktop/Contato";
import { Cronograma } from "./screens/Desktop/Cronograma";
import { Depoimentos } from "./screens/Desktop/Depoimentos";
import { DashboardAtividades } from "./screens/Desktop/DashboardAtividades";
import { DashboardAvisos } from "./screens/Desktop/DashboardAvisos";
import { DashboardCronograma } from "./screens/Desktop/DashboardCronograma";
import { DashboardDepoimentos } from "./screens/Desktop/DashboardDepoimentos";
import { DashboardDocumentos } from "./screens/Desktop/DashboardDocumentos";
import { DashboardEventos } from "./screens/Desktop/DashboardEventos";
import { DashboardGaleriaFotos } from "./screens/Desktop/DashboardGaleriaFotos";
import { DashboardMensagens } from "./screens/Desktop/DashboardMensagens";
import { DashboardMenu } from "./screens/Desktop/DashboardMenu";
import { DashboardMidias } from "./screens/Desktop/DashboardMidias";
import { DashboardPatrocinadores } from "./screens/Desktop/DashboardPatrocinador";
import { DashboardSobre } from "./screens/Desktop/DashboardSobre";
import { Avisos } from "./screens/Desktop/Avisos";
import { Midia } from "./screens/Desktop/Midia";
import { Login } from "./screens/Desktop/Login";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="avisos" element={<Avisos />} />
          <Route path="contato" element={<Contato />} />
          <Route path="contribua" element={<Contribua />} />
          <Route path="cronograma" element={<Cronograma />} />
          <Route path="depoimentos" element={<Depoimentos />} />
          <Route path="login" element={<Login />} />
          <Route path="midia" element={<Midia />} />
          <Route path="sobre" element={<Sobre />} />

          <Route element={<ProtectedRoute /> }>
            <Route path="d_atividades" element={<DashboardAtividades />} />
            <Route path="d_avisos" element={<DashboardAvisos />} />
            <Route path="d_cronograma" element={<DashboardCronograma />} />
            <Route path="d_depoimentos" element={<DashboardDepoimentos />} />
            <Route path="d_documentos" element={<DashboardDocumentos />} />
            <Route path="d_eventos" element={<DashboardEventos />} />
            <Route path="d_galeria" element={<DashboardGaleriaFotos />} />
            <Route path="d_mensagens" element={<DashboardMensagens />} />
            <Route path="d_menu" element={<DashboardMenu />} />
            <Route path="d_midias" element={<DashboardMidias />} />
            <Route path="d_patrocinadores" element={<DashboardPatrocinadores />} />
            <Route path="d_sobre" element={<DashboardSobre />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
