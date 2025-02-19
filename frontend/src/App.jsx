import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import NavBarEdunova from './components/NavBarEdunova'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Pocetna from './pages/Pocetna'
import DjelatniciPregled from './pages/djelatnici/djelatniciPregled'
import DjelatniciDodaj from './pages/djelatnici/djelatniciDodaj'
import DjelatniciPromjena from './pages/djelatnici/djelatniciPromjena'



function App() {

  return (
    <>
      <Container>
        <NavBarEdunova />
        
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          <Route path={RouteNames.DJELATNIK_PREGLED} element={<djelatniciPregled />} />
          <Route path={RouteNames.DJELATNIK_NOVI} element={<djelatniciDodaj />} />
          <Route path={RouteNames.DJELATNIK_PROMJENA} element={<djelatniciPromjena />} />
        </Routes>

        <hr />
        &copy; MIRZVS 2025
      </Container>
     
    </>
  )
}

export default App
