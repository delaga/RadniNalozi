import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import TrosakService from "../../services/TrosakService";
import { useEffect, useState } from "react";
import VrstaTroskaService from "../../services/VrstaTroskaService";
import RadniNalogService from "../../services/RadniNalogService";


export default function TroskoviDodaj(){

    const navigate = useNavigate();
    const [vrsteTroskova, setVrsteTroskova] = useState([]);
    const [radniNalozi, setRadniNalozi] = useState([]);

    async function dohvatiVrsteTroskova(){
        const odgovor = await VrstaTroskaService.get();
        setVrsteTroskova(odgovor);
    }

    async function dohvatiRadniNalozi(){
        const odgovor = await RadniNalogService.get();
        setRadniNalozi(odgovor);
    }

    useEffect(()=>{
        dohvatiVrsteTroskova();
        dohvatiRadniNalozi();
    },[]);

    async function dodaj(trosak){
        const odgovor = await TrosakService.dodaj(trosak);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.TROSAK_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        const trosak = {
            naziv: podaci.get('naziv'),
            vrsta: parseInt(podaci.get('vrsta')),
            radniNalog: parseInt(podaci.get('radniNalog')),
            kolicina: parseFloat(podaci.get('kolicina')),
            cijena: parseFloat(podaci.get('cijena')),
        };

        dodaj(trosak);
    }

    return(
    <>
    Dodavanje Troška
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" required />
        </Form.Group>

        <Form.Group controlId="vrsta">
            <Form.Label>Vrsta troška</Form.Label>
            <Form.Select name="vrsta" required>
                <option value="">Odaberite vrstu troška</option>
                {vrsteTroskova && vrsteTroskova.map((vt,index)=>(
                    <option key={index} value={vt.sifra}>{vt.naziv}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="radniNalog">
            <Form.Label>Radni nalog</Form.Label>
            <Form.Select name="radniNalog" required>
                <option value="">Odaberite radni nalog</option>
                {radniNalozi && radniNalozi.map((rn,index)=>(
                    <option key={index} value={rn.sifra}>RN-{rn.sifra} ({rn.djelatnikImePrezime} - {rn.klijentNaziv})</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="kolicina">
            <Form.Label>Količina</Form.Label>
            <Form.Control type="number" name="kolicina" step={0.01} required />
        </Form.Group>

        <Form.Group controlId="cijena">
            <Form.Label>Cijena</Form.Label>
            <Form.Control type="number" name="cijena" step={0.01} required />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.TROSAK_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj Trošak
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
