import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import RadniSatiPoMjesecuService from "../../services/RadniSatiPoMjesecuService";
import { useEffect, useState } from "react";


export default function RadniSatiPromjena(){

    const navigate = useNavigate();
    const [radniSati,setRadniSati] = useState({});
    const routeParams = useParams();

    async function dohvatiRadniSati(){
        const odgovor = await RadniSatiPoMjesecuService.getBySifra(routeParams.sifra)
        setRadniSati(odgovor);
    }

    useEffect(()=>{
        dohvatiRadniSati();
    },[])

    async function promjena(radniSati){
        const odgovor = await RadniSatiPoMjesecuService.promjena(routeParams.sifra,radniSati);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.RADNISATI_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        promjena(
            {
                godina: parseInt(podaci.get('godina')),
                mjesec: podaci.get('mjesec'),
                sati: parseInt(podaci.get('sati')),
            }
        );
    }

    return(
    <>
    Promjena radnih sati po mjesecu
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="godina">
            <Form.Label>Godina</Form.Label>
            <Form.Control type="number" name="godina" required min={2000} max={2100} defaultValue={radniSati.godina} />
        </Form.Group>

        <Form.Group controlId="mjesec">
            <Form.Label>Mjesec</Form.Label>
            <Form.Control type="text" name="mjesec" maxLength={2} required defaultValue={radniSati.mjesec} />
            <Form.Text className="text-muted">
                Unesite mjesec kao dvoznamenkasti broj (01-12)
            </Form.Text>
        </Form.Group>

        <Form.Group controlId="sati">
            <Form.Label>Sati</Form.Label>
            <Form.Control type="number" name="sati" required min={0} defaultValue={radniSati.sati} />
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
                    Promjeni radne sate
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
