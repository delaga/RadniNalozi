import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import PosaoService from "../../services/PosaoService";


export default function PosloviDodaj(){

    const navigate = useNavigate();

    async function dodaj(posao){
        const odgovor = await PosaoService.dodaj(posao);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.POSAO_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        dodaj(
            {
                nazivPosla: podaci.get('nazivPosla'),
                vrijednost: parseFloat(podaci.get('vrijednost')),
            }
        );
    }

    return(
    <>
    Dodavanje Posla
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="nazivPosla">
            <Form.Label>Naziv posla</Form.Label>
            <Form.Control type="text" name="nazivPosla" required />
        </Form.Group>

        <Form.Group controlId="vrijednost">
            <Form.Label>Vrijednost</Form.Label>
            <Form.Control type="number" name="vrijednost" step={0.01} required />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.POSAO_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj Posao
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
