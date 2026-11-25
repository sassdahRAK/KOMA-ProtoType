import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Layout.jsx'
import { LanguageProvider } from './lib/i18n.jsx'
import Home from './pages/Home.jsx'
import Ask from './pages/Ask.jsx'
import MapPage from './pages/Map.jsx'
import Medicine from './pages/Medicine.jsx'
import Doctor from './pages/Doctor.jsx'
import Safety from './pages/Safety.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/medicine" element={<Medicine />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </LanguageProvider>
  )
}
