import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import RadniNalogService from "../../services/RadniNalogService";
import { useEffect, useState } from "react";
import DjelatnikService from "../../services/DjelatnikService";
import KlijentService from "../../services/KlijentService";
import moment from "moment";


export default function RadniNaloziPromjena(){

    const navigate = useNavigate();
    const [radniNalog, setRadniNalog] = useState({});
    const [djelatnici, setDjelatnici] = useState([]);
    const [klijenti, setKlijenti] = useState([]);
    const routeParams = useParams();

    async function dohvatiRadniNalog(){
        const odgovor = await RadniNalogService.getBySifra(routeParams.sifra);
        
        // Format dates for the datetime-local input if they exist
        if(odgovor.vrijemePocetka) {
            odgovor.vrijemePocetkaFormatirano = moment.utc(odgovor.vrijemePocetka).format('YYYY-MM-DDTHH:mm');
        }
        if(odgovor.vrijemeZavrsetka) {
            odgovor.vrijemeZavrsetkaFormatirano = moment.utc(odgovor.vrijemeZavrsetka).format('YYYY-MM-DDTHH:mm');
        }
        
        setRadniNalog(odgovor);
    }

    async function dohvatiDjelatnici(){
        const odgovor = await DjelatnikService.get();
        setDjelatnici(odgovor);
    }

    async function dohvatiKlijenti(){
        const odgovor = await KlijentService.get();
        setKlijenti(odgovor);
    }

    useEffect(()=>{
        dohvatiRadniNalog();
        dohvatiDjelatnici();
        dohvatiKlijenti();
    },[]);

    async function promjena(radniNalog){
        const odgovor = await RadniNalogService.promjena(routeParams.sifra, radniNalog);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.RADNINALOG_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        const updatedRadniNalog = {
            djelatnik: parseInt(podaci.get('djelatnik')),
            klijent: parseInt(podaci.get('klijent')),
            vrijemePocetka: podaci.get('vrijemePocetka') ? new Date(podaci.get('vrijemePocetka')).toISOString() : null,
            vrijemeZavrsetka: podaci.get('vrijemeZavrsetka') ? new Date(podaci.get('vrijemeZavrsetka')).toISOString() : null,
            radnihSati: podaci.get('radnihSati') ? parseFloat(podaci.get('radnihSati')) : null,
            napomena: podaci.get('napomena').trim() === '' ? null : podaci.get('napomena').trim()
        };

        promjena(updatedRadniNalog);
    }

    return(
    <>
    Promjena Radnog naloga
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="djelatnik">
            <Form.Label>Djelatnik</Form.Label>
            <Form.Select name="djelatnik" required defaultValue={radniNalog.djelatnik}>
                <option value="">Odaberite djelatnika</option>
                {djelatnici && djelatnici.map((d,index)=>(
                    <option key={index} value={d.sifra}>{d.ime} {d.prezime}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="klijent">
            <Form.Label>Klijent</Form.Label>
            <Form.Select name="klijent" required defaultValue={radniNalog.klijent}>
                <option value="">Odaberite klijenta</option>
                {klijenti && klijenti.map((k,index)=>(
                    <option key={index} value={k.sifra}>{k.naziv}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="vrijemePocetka">
            <Form.Label>Vrijeme početka</Form.Label>
            <Form.Control 
                type="datetime-local" 
                name="vrijemePocetka" 
                defaultValue={radniNalog.vrijemePocetkaFormatirano} 
            />
        </Form.Group>

        <Form.Group controlId="vrijemeZavrsetka">
            <Form.Label>Vrijeme završetka</Form.Label>
            <Form.Control 
                type="datetime-local" 
                name="vrijemeZavrsetka" 
                defaultValue={radniNalog.vrijemeZavrsetkaFormatirano} 
            />
        </Form.Group>

        <Form.Group controlId="radnihSati">
            <Form.Label>Radnih sati</Form.Label>
            <Form.Control 
                type="number" 
                name="radnihSati" 
                step={0.1} 
                defaultValue={radniNalog.radnihSati} 
            />
        </Form.Group>

        <Form.Group controlId="napomena">
            <Form.Label>Napomena</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={3} 
                name="napomena" 
                defaultValue={radniNalog.napomena} 
            />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.RADNINALOG_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Promjeni Radni nalog
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
