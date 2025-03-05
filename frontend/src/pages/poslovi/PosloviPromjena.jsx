import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import PosaoService from "../../services/PosaoService";
import { useEffect, useState } from "react";


export default function PosloviPromjena(){

    const navigate = useNavigate();
    const [posao,setPosao] = useState({});
    const routeParams = useParams();

    async function dohvatiPosao(){
        const odgovor = await PosaoService.getBySifra(routeParams.sifra)
        setPosao(odgovor);
    }

    useEffect(()=>{
        dohvatiPosao();
    },[])

    async function promjena(posao){
        const odgovor = await PosaoService.promjena(routeParams.sifra,posao);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.POSAO_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        promjena(
            {
                nazivPosla: podaci.get('nazivPosla'),
                vrijednost: parseFloat(podaci.get('vrijednost')),
            }
        );
    }

    return(
    <>
    Promjena posla
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="nazivPosla">
            <Form.Label>Naziv posla</Form.Label>
            <Form.Control type="text" name="nazivPosla" required defaultValue={posao.nazivPosla} />
        </Form.Group>

        <Form.Group controlId="vrijednost">
            <Form.Label>Vrijednost</Form.Label>
            <Form.Control type="number" name="vrijednost" step={0.01} required defaultValue={posao.vrijednost} />
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
                    Promjeni posao
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
