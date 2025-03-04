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
          <Route path="/klijenti" element={<KlijentiPregled />} />
          <Route path="/klijenti/dodaj" element={<KlijentiDodaj />} />
          <Route path="/klijenti/promjena/:sifra" element={<KlijentiPromjena />} />
        </Routes>

        <hr />
        &copy; MIRZVS® 2025
      </Container>
     
    </>
  )
}

export default App
