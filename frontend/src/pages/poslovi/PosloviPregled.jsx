import { useEffect, useState } from "react"
import PosaoService from "../../services/PosaoService"
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function PosloviPregled(){

    const[poslovi, setPoslovi] = useState();
    const navigate = useNavigate();

    async function dohvatiPoslovi(){
        const odgovor = await PosaoService.get()
        setPoslovi(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu
    useEffect(()=>{
        dohvatiPoslovi();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjePosao(sifra);
    }

    async function brisanjePosao(sifra) {
        const odgovor = await PosaoService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiPoslovi();
    }


    return(
        <>
        <Link
        to={RouteNames.POSAO_NOVI}
        className="btn btn-success siroko"
        >Dodaj novi posao</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv posla</th>
                    <th>Vrijednost</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {poslovi && poslovi.map((p,index)=>(
                    <tr key={index}>
                        <td>
                            {p.nazivPosla}
                        </td>
                        
                        <td>
                            {p.vrijednost}
                        </td>
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/poslovi/${p.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(p.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
