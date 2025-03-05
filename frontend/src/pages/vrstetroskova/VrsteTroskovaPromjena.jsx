import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import VrstaTroskaService from "../../services/VrstaTroskaService";
import { useEffect, useState } from "react";


export default function VrsteTroskovaPromjena(){

    const navigate = useNavigate();
    const [vrstaTroska,setVrstaTroska] = useState({});
    const routeParams = useParams();

    async function dohvatiVrstaTroska(){
        const odgovor = await VrstaTroskaService.getBySifra(routeParams.sifra)
        setVrstaTroska(odgovor);
    }

    useEffect(()=>{
        dohvatiVrstaTroska();
    },[])

    async function promjena(vrstaTroska){
        const odgovor = await VrstaTroskaService.promjena(routeParams.sifra,vrstaTroska);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.VRSTATROSKA_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        promjena(
            {
                naziv: podaci.get('naziv')
            }
        );
    }

    return(
    <>
    Promjena vrste troška
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" required defaultValue={vrstaTroska.naziv} />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.VRSTATROSKA_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Promjeni vrstu troška
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
