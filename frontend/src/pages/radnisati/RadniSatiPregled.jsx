import { useEffect, useState } from "react"
import RadniSatiPoMjesecuService from "../../services/RadniSatiPoMjesecuService"
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function RadniSatiPregled(){

    const[radniSati, setRadniSati] = useState();
    const navigate = useNavigate();

    async function dohvatiRadniSati(){
        const odgovor = await RadniSatiPoMjesecuService.get()
        setRadniSati(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu
    useEffect(()=>{
        dohvatiRadniSati();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeRadniSati(sifra);
    }

    async function brisanjeRadniSati(sifra) {
        const odgovor = await RadniSatiPoMjesecuService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiRadniSati();
    }


    return(
        <>
        <Link
        to={RouteNames.RADNISATI_NOVI}
        className="btn btn-success siroko"
        >Dodaj nove radne sate po mjesecu</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Godina</th>
                    <th>Mjesec</th>
                    <th>Sati</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {radniSati && radniSati.map((rs,index)=>(
                    <tr key={index}>
                        <td>
                            {rs.godina}
                        </td>
                        
                        <td>
                            {rs.mjesec}
                        </td>

                        <td>
                            {rs.sati}
                        </td>
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/radnisati/${rs.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(rs.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
