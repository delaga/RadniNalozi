import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import DjelatnikService from "../../services/DjelatnikService.ts";
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
                brutto2placa: parseFloat(podaci.get('brutto2Placa')),
               
            }
        );
    }

    return(
    <>
    Promjena djelatnika
    <Form onSubmit={odradiSubmit}>

    <Form.Group controlId="ime">
            <Form.Label>Ime</Form.Label>
            <Form.Control type="text" name="ime" required defaultValue={djelatnik.ime}/>
        </Form.Group>

        <Form.Group controlId="prezime">
            <Form.Label>Prezime</Form.Label>
            <Form.Control type="text" name="prezime" required  defaultValue={djelatnik.prezime}/>
        </Form.Group>

        <Form.Group controlId="telefon">
            <Form.Label>Telefon</Form.Label>
            <Form.Control type="text" name="telefon"  defaultValue={djelatnik.telefon} />
        </Form.Group>

        <Form.Group controlId="Email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email"  defaultValue={djelatnik.email} />
        </Form.Group>

        <Form.Group controlId="brutto2Placa">
            <Form.Label>Brutto2 plaća</Form.Label>
            <Form.Control type="number" name="brutto2Placa" step={0.01}  defaultValue={djelatnik.brutto2Placa} />
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
