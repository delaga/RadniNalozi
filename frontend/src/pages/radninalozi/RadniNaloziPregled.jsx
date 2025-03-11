import { useEffect, useState } from "react"
import RadniNalogService from "../../services/RadniNalogService"
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";


export default function RadniNaloziPregled(){

    const[radniNalozi, setRadniNalozi] = useState();
    const[selectedRadniNalog, setSelectedRadniNalog] = useState(null);
    const[poslovi, setPoslovi] = useState([]);
    const[troskovi, setTroskovi] = useState([]);
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
        // Reset selected radni nalog and related data
        setSelectedRadniNalog(null);
        setPoslovi([]);
        setTroskovi([]);
    }

    async function dohvatiPoslove(sifra) {
        const odgovor = await RadniNalogService.getPoslovi(sifra);
        setPoslovi(odgovor || []);
    }

    async function dohvatiTroskove(sifra) {
        const odgovor = await RadniNalogService.getTroskovi(sifra);
        setTroskovi(odgovor || []);
    }

    function selectRadniNalog(rn) {
        if (selectedRadniNalog && selectedRadniNalog.sifra === rn.sifra) {
            // If clicking the same row, deselect it
            setSelectedRadniNalog(null);
            setPoslovi([]);
            setTroskovi([]);
        } else {
            // Select the new row
            setSelectedRadniNalog(rn);
            dohvatiPoslove(rn.sifra);
            dohvatiTroskove(rn.sifra);
        }
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
                    <th>Radni nalog</th>
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
                    <tr 
                        key={index} 
                        onClick={() => selectRadniNalog(rn)}
                        className={selectedRadniNalog && selectedRadniNalog.sifra === rn.sifra ? 'table-primary' : ''}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>
                            Broj: {rn.sifra}
                        </td>
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
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/radninalozi/${rn.sifra}`);
                            }}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                obrisi(rn.sifra);
                            }}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        
        {selectedRadniNalog && (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <h4>Poslovi za radni nalog: {selectedRadniNalog.sifra}</h4>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Opis</th>
                                    <th>Vrijednost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poslovi.length > 0 ? (
                                    poslovi.map((posao, index) => (
                                        <tr key={index}>
                                            <td>{posao.naziv}</td>
                                            <td>{posao.opis}</td>
                                            <td>{posao.vrijednost}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">Nema poslova za ovaj radni nalog</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <h4>Troškovi za radni nalog: {selectedRadniNalog.sifra}</h4>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Vrsta</th>
                                    <th>Količina</th>
                                    <th>Cijena</th>
                                    <th>Ukupno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {troskovi.length > 0 ? (
                                    troskovi.map((trosak, index) => (
                                        <tr key={index}>
                                            <td>{trosak.naziv}</td>
                                            <td>{trosak.vrstaNaziv}</td>
                                            <td>{trosak.kolicina}</td>
                                            <td>{trosak.cijena} €</td>
                                            <td>{trosak.ukupno} €</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Nema troškova za ovaj radni nalog</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        )}
        </>
    )
}
