import { useEffect, useState } from "react"
import VrstaTroskaService from "../../services/VrstaTroskaService"
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function VrsteTroskovaPregled(){

    const[vrsteTroskova, setVrsteTroskova] = useState();
    const navigate = useNavigate();

    async function dohvatiVrsteTroskova(){
        const odgovor = await VrstaTroskaService.get()
        setVrsteTroskova(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu
    useEffect(()=>{
        dohvatiVrsteTroskova();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeVrstaTroska(sifra);
    }

    async function brisanjeVrstaTroska(sifra) {
        const odgovor = await VrstaTroskaService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiVrsteTroskova();
    }


    return(
        <>
        <Link
        to={RouteNames.VRSTATROSKA_NOVI}
        className="btn btn-success siroko"
        >Dodaj novu vrstu troška</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {vrsteTroskova && vrsteTroskova.map((vt,index)=>(
                    <tr key={index}>
                        <td>
                            {vt.naziv}
                        </td>
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/vrstetroskova/${vt.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(vt.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
