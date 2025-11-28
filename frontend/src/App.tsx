import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ReportIncident from './components/ReportIncident'
import EmergencyAssistance from './components/EmergencyAssistance'
import SupportServices from './components/SupportServices'
import EvidenceVault from './components/EvidenceVault'
import Settings from './components/Settings'
import FakeCalculator from './components/FakeCalculator'
import Navigation from './components/Navigation'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/emergency" element={<EmergencyAssistance />} />
        <Route path="/support" element={<SupportServices />} />
        <Route path="/vault" element={<EvidenceVault />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calculator" element={<FakeCalculator />} />
      </Routes>
      <Navigation />
    </>
  )
}

export default App
