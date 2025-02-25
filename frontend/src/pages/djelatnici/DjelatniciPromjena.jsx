import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import DjelatnikService from "../../services/DjelatnikService";
import { useEffect, useState } from "react";


export default function DjelatniciPromjena(){

    const navigate = useNavigate();
    const [djelatnik,setDjelatnik] = useState({});
    //const [vaucer,setVaucer] = useState(false)
    const routeParams = useParams();

    async function dohvatiDjelatnik(){
        const odgovor = await DjelatnikService.getBySifra(routeParams.sifra)

        if(odgovor.izvodiSeOd!=null){
            odgovor.izvodiSeOd = moment.utc(odgovor.izvodiSeOd).format('yyyy-MM-DD')
        }
        
        setDjelatnik(odgovor)
        //setVaucer(odgovor.vaucer)
    }

    useEffect(()=>{
        dohvatiDjelatnik();
    },[])

    async function promjena(djelatnik){
        const odgovor = await DjelatnikService.promjena(routeParams.sifra,djelatnik);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.DJELATNIK_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        promjena(
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
    Promjena djelatnika
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
                    Promjeni djelatnik
                </Button>
            </Col>
        </Row>


    </Form>




   
    </>
    )
}