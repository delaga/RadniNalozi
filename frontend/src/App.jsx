import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import DjelatniciPregled from './pages/djelatnici/DjelatniciPregled'
import DjelatniciDodaj from './pages/djelatnici/DjelatniciDodaj'
import DjelatniciPromjena from './pages/djelatnici/DjelatniciPromjena'
import KlijentiPregled from './pages/klijenti/KlijentiPregled'
import KlijentiDodaj from './pages/klijenti/KlijentiDodaj'
import KlijentiPromjena from './pages/klijenti/KlijentiPromjena'
import PosloviPregled from './pages/poslovi/PosloviPregled'
import PosloviDodaj from './pages/poslovi/PosloviDodaj'
import PosloviPromjena from './pages/poslovi/PosloviPromjena'
import VrsteTroskovaPregled from './pages/vrstetroskova/VrsteTroskovaPregled'
import VrsteTroskovaDodaj from './pages/vrstetroskova/VrsteTroskovaDodaj'
import VrsteTroskovaPromjena from './pages/vrstetroskova/VrsteTroskovaPromjena'
import RadniSatiPregled from './pages/radnisati/RadniSatiPregled'
import RadniSatiDodaj from './pages/radnisati/RadniSatiDodaj'
import RadniSatiPromjena from './pages/radnisati/RadniSatiPromjena'
import RadniNaloziPregled from './pages/radninalozi/RadniNaloziPregled'
import RadniNaloziDodaj from './pages/radninalozi/RadniNaloziDodaj'
import RadniNaloziPromjena from './pages/radninalozi/RadniNaloziPromjena'
import TroskoviPregled from './pages/troskovi/TroskoviPregled'
import TroskoviDodaj from './pages/troskovi/TroskoviDodaj'
import TroskoviPromjena from './pages/troskovi/TroskoviPromjena'



function App() {

  return (
    <>
      <Container>
        <NavBarEdunova />
        
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          <Route path={RouteNames.DJELATNIK_PREGLED} element={<DjelatniciPregled />} />
          <Route path={RouteNames.DJELATNIK_NOVI} element={<DjelatniciDodaj />} />
          <Route path={RouteNames.DJELATNIK_PROMJENA} element={<DjelatniciPromjena />} />
          <Route path={RouteNames.KLIJENT_PREGLED} element={<KlijentiPregled />} />
          <Route path={RouteNames.KLIJENT_NOVI} element={<KlijentiDodaj />} />
          <Route path={RouteNames.KLIJENT_PROMJENA} element={<KlijentiPromjena />} />
          <Route path={RouteNames.POSAO_PREGLED} element={<PosloviPregled />} />
          <Route path={RouteNames.POSAO_NOVI} element={<PosloviDodaj />} />
          <Route path={RouteNames.POSAO_PROMJENA} element={<PosloviPromjena />} />
          <Route path={RouteNames.VRSTATROSKA_PREGLED} element={<VrsteTroskovaPregled />} />
          <Route path={RouteNames.VRSTATROSKA_NOVI} element={<VrsteTroskovaDodaj />} />
          <Route path={RouteNames.VRSTATROSKA_PROMJENA} element={<VrsteTroskovaPromjena />} />
          <Route path={RouteNames.RADNISATI_PREGLED} element={<RadniSatiPregled />} />
          <Route path={RouteNames.RADNISATI_NOVI} element={<RadniSatiDodaj />} />
          <Route path={RouteNames.RADNISATI_PROMJENA} element={<RadniSatiPromjena />} />
          <Route path={RouteNames.RADNINALOG_PREGLED} element={<RadniNaloziPregled />} />
          <Route path={RouteNames.RADNINALOG_NOVI} element={<RadniNaloziDodaj />} />
          <Route path={RouteNames.RADNINALOG_PROMJENA} element={<RadniNaloziPromjena />} />
          <Route path={RouteNames.TROSAK_PREGLED} element={<TroskoviPregled />} />
          <Route path={RouteNames.TROSAK_NOVI} element={<TroskoviDodaj />} />
          <Route path={RouteNames.TROSAK_PROMJENA} element={<TroskoviPromjena />} />
        </Routes>

        <hr />
        &copy; MIRZVS® 2025
      </Container>
     
    </>
  )
}

export default App
