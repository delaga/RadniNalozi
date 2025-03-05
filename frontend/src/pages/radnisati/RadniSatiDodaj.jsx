import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import RadniSatiPoMjesecuService from "../../services/RadniSatiPoMjesecuService";


export default function RadniSatiDodaj(){

    const navigate = useNavigate();

    async function dodaj(radniSati){
        const odgovor = await RadniSatiPoMjesecuService.dodaj(radniSati);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.RADNISATI_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        dodaj(
            {
                godina: parseInt(podaci.get('godina')),
                mjesec: podaci.get('mjesec'),
                sati: parseInt(podaci.get('sati')),
            }
        );
    }

    return(
    <>
    Dodavanje Radnih sati po mjesecu
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="godina">
            <Form.Label>Godina</Form.Label>
            <Form.Control type="number" name="godina" required min={2000} max={2100} />
        </Form.Group>

        <Form.Group controlId="mjesec">
            <Form.Label>Mjesec</Form.Label>
            <Form.Control type="text" name="mjesec" maxLength={2} required />
            <Form.Text className="text-muted">
                Unesite mjesec kao dvoznamenkasti broj (01-12)
            </Form.Text>
        </Form.Group>

        <Form.Group controlId="sati">
            <Form.Label>Sati</Form.Label>
            <Form.Control type="number" name="sati" required min={0} />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.RADNISATI_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj Radne sate
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
