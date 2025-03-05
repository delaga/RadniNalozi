import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KlijentService from "../../services/KlijentService";


export default function KlijentiDodaj(){

    const navigate = useNavigate();

    async function dodaj(klijent){
        const odgovor = await KlijentService.dodaj(klijent);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.KLIJENT_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        dodaj(
            {
                naziv: podaci.get('naziv'),
                oib: podaci.get('oib').trim()=='' ? null : podaci.get('oib').trim(),
                adresa: podaci.get('adresa').trim()=='' ? null : podaci.get('adresa').trim(),
                email: podaci.get('email').trim()=='' ? null : podaci.get('email').trim(),
                odgovornaOsoba: podaci.get('odgovornaOsoba').trim()=='' ? null : podaci.get('odgovornaOsoba').trim(),
            }
        );
    }

    return(
    <>
    Dodavanje Klijenta
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" required />
        </Form.Group>

        <Form.Group controlId="oib">
            <Form.Label>OIB</Form.Label>
            <Form.Control type="text" name="oib" maxLength={11} />
        </Form.Group>

        <Form.Group controlId="adresa">
            <Form.Label>Adresa</Form.Label>
            <Form.Control type="text" name="adresa" />
        </Form.Group>

        <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" />
        </Form.Group>

        <Form.Group controlId="odgovornaOsoba">
            <Form.Label>Odgovorna osoba</Form.Label>
            <Form.Control type="text" name="odgovornaOsoba" />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.KLIJENT_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj Klijent
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
