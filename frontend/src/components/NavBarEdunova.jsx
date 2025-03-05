import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { PRODUKCIJA, RouteNames } from '../constants';



export default function NavBarEdunova(){

    const navigate = useNavigate(); // ; u pravilu i ne treba


    return(
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand 
                className='ruka'
                onClick={()=>navigate(RouteNames.HOME)}
                >Radni nalozi</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                 
                    <NavDropdown title="Programi" id="basic-nav-dropdown">
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.DJELATNIK_PREGLED)}
                    >Djelatnici</NavDropdown.Item>
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.KLIJENT_PREGLED)}
                    >Klijenti</NavDropdown.Item>
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.POSAO_PREGLED)}
                    >Poslovi</NavDropdown.Item>
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.VRSTATROSKA_PREGLED)}
                    >Vrste troškova</NavDropdown.Item>
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.RADNISATI_PREGLED)}
                    >Radni sati po mjesecu</NavDropdown.Item>
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.RADNINALOG_PREGLED)}
                    >Radni nalozi</NavDropdown.Item>
                    <NavDropdown.Item
                    onClick={()=>navigate(RouteNames.TROSAK_PREGLED)}
                    >Troškovi</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href={PRODUKCIJA + '/swagger'} target='_blank'>Swagger</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}
