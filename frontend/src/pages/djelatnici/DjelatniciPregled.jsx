import { useEffect, useState } from "react"
import DjelatnikService from "../../services/DjelatnikService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function DjelatniciPregled(){

    const[djelatnici, setDjelatnici] = useState();
    const navigate = useNavigate();

    async function dohvatiDjelatnici(){
        const odgovor = await DjelatnikService.get()
        setDjelatnici(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu Smjerovi
    useEffect(()=>{
        dohvatiDjelatnici();
    },[])


    function formatirajDatum(datum){
        if(datum==null){
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD. MM. YYYY.')
    }

    function vaucer(v){
        if(v==null) return 'gray'
        if(v) return 'green'
        return 'red'
    }

    function vaucerText(v){
        if(v==null) return 'Nije definirano'
        if(v) return 'Vaučer'
        return 'NIJE vaučer'
    }

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeDjelatnik(sifra);
    }

    async function brisanjeDjelatnik(sifra) {
        const odgovor = await DjelatnikService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiDjelatnici();
    }


    return(
        <>
        <Link
        to={RouteNames.DJELATNIK_NOVI}
        className="btn btn-success siroko"
        >Dodaj novi djelatnik</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Telefon</th>
                    <th>e-pošta</th>
                    <th>Brutto 2 plaća</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {smjerovi && smjerovi.map((smjer,index)=>(
                    <tr key={index}>
                        <td>
                            {smjer.ime}
                        </td>
                        
                        <td>
                            {smjer.prezime}
                        </td>

                        <td>
                            {smjer.telefon}
                        </td>

                        <td>
                            {smjer.email}
                        </td>

                        <td>
                            {smjer.brutto2Placa}
                        </td>
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/djelatnici/${djelatnik.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(djelatnik.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )


}