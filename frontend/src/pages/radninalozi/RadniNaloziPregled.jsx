import { useEffect, useState } from "react"
import RadniNalogService from "../../services/RadniNalogService"
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";


export default function RadniNaloziPregled(){

    const[radniNalozi, setRadniNalozi] = useState();
    const navigate = useNavigate();

    async function dohvatiRadniNalozi(){
        const odgovor = await RadniNalogService.get()
        setRadniNalozi(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu
    useEffect(()=>{
        dohvatiRadniNalozi();
    },[])

    function formatirajDatum(datum){
        if(datum==null){
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD. MM. YYYY. HH:mm')
    }

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeRadniNalog(sifra);
    }

    async function brisanjeRadniNalog(sifra) {
        const odgovor = await RadniNalogService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiRadniNalozi();
    }


    return(
        <>
        <Link
        to={RouteNames.RADNINALOG_NOVI}
        className="btn btn-success siroko"
        >Dodaj novi radni nalog</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Djelatnik</th>
                    <th>Klijent</th>
                    <th>Vrijeme početka</th>
                    <th>Vrijeme završetka</th>
                    <th>Radnih sati</th>
                    <th>Napomena</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {radniNalozi && radniNalozi.map((rn,index)=>(
                    <tr key={index}>
                        <td>
                            {rn.djelatnikImeIPrezime}
                        </td>
                        
                        <td>
                            {rn.klijentNaziv}
                        </td>

                        <td>
                            {formatirajDatum(rn.vrijemePocetka)}
                        </td>

                        <td>
                            {formatirajDatum(rn.vrijemeZavrsetka)}
                        </td>

                        <td>
                            {rn.radnihSati}
                        </td>

                        <td>
                            {rn.napomena}
                        </td>
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/radninalozi/${rn.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(rn.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
