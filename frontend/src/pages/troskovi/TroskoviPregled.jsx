import { useEffect, useState } from "react"
import TrosakService from "../../services/TrosakService"
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { NumericFormat } from "react-number-format";


export default function TroskoviPregled(){

    const[troskovi, setTroskovi] = useState();
    const navigate = useNavigate();

    async function dohvatiTroskovi(){
        const odgovor = await TrosakService.get()
        setTroskovi(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu
    useEffect(()=>{
        dohvatiTroskovi();
    },[])

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeTrosak(sifra);
    }

    async function brisanjeTrosak(sifra) {
        const odgovor = await TrosakService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiTroskovi();
    }


    return(
        <>
        <Link
        to={RouteNames.TROSAK_NOVI}
        className="btn btn-success siroko"
        >Dodaj novi trošak</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>Vrsta troška</th>
                    <th>Radni nalog</th>
                    <th>Količina</th>
                    <th>Cijena</th>
                    <th>Ukupno</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {troskovi && troskovi.map((t,index)=>(
                    <tr key={index}>
                        <td>
                            {t.naziv}
                        </td>
                        
                        <td>
                            {t.vrstaNaziv}
                        </td>

                        <td>
                            {t.radniNalogInfo}
                        </td>

                        <td className="text-end">
                            <NumericFormat 
                                value={t.kolicina} 
                                displayType={'text'} 
                                thousandSeparator='.' 
                                decimalSeparator=',' 
                                decimalScale={2}
                                fixedDecimalScale
                            />
                        </td>

                        <td className="text-end">
                            <NumericFormat 
                                value={t.cijena} 
                                displayType={'text'} 
                                thousandSeparator='.' 
                                decimalSeparator=',' 
                                decimalScale={2}
                                fixedDecimalScale
                            />
                        </td>

                        <td className="text-end">
                            <NumericFormat 
                                value={t.ukupno} 
                                displayType={'text'} 
                                thousandSeparator='.' 
                                decimalSeparator=',' 
                                decimalScale={2}
                                fixedDecimalScale
                            />
                        </td>
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/troskovi/${t.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(t.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )
}
