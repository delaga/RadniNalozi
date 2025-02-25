import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import DjelatnikService from "../../services/DjelatnikService";


export default function DjelatniciDodaj(){

    const navigate = useNavigate();

    async function dodaj(Djelatnik){
        const odgovor = await DjelatnikService.dodaj(Djelatnik);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.DJELATNIK_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        dodaj(
            {
                ime: podaci.get('ime'),
                prezime: podaci.get('prezime'),
                telefon: podaci.get('telefon'),
                email: podaci.get('email'),
                brutto2placa: parseFloat(podaci.get('brutto2placa')),
             
            }
        );
    }

    return(
    <>
    Dodavanje Djelatnika
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="ime">
            <Form.Label>Ime</Form.Label>
            <Form.Control type="text" name="ime" required />
        </Form.Group>

        <Form.Group controlId="prezime">
            <Form.Label>Prezime</Form.Label>
            <Form.Control type="text" name="prezime" required />
        </Form.Group>

        <Form.Group controlId="telefon">
            <Form.Label>Telefon</Form.Label>
            <Form.Control type="text" name="telefon" required />
        </Form.Group>

        <Form.Group controlId="Email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" required />
        </Form.Group>

        <Form.Group controlId="brutto2placa">
            <Form.Label>Brutto2 plaća</Form.Label>
            <Form.Control type="number" name="brutto2placa" step={0.01} />
        </Form.Group>

        

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.DJELATNIK_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj Djelatnik
                </Button>
            </Col>
        </Row>


    </Form>




   
    </>
    )
}