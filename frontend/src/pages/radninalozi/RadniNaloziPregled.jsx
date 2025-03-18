import { useEffect, useState } from "react"
import RadniNalogService from "../../services/RadniNalogService"
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";


export default function RadniNaloziPregled(){

    // State varijable
    const[radniNalozi, setRadniNalozi] = useState(); // Lista svih radnih naloga
    const[selectedRadniNalog, setSelectedRadniNalog] = useState(null); // Trenutno odabrani radni nalog
    const[poslovi, setPoslovi] = useState([]); // Poslovi vezani za odabrani radni nalog
    const[troskovi, setTroskovi] = useState([]); // Troškovi vezani za odabrani radni nalog
    const navigate = useNavigate();

    async function dohvatiRadniNalozi(){
        const odgovor = await RadniNalogService.get()
        console.log('Radni nalozi:', odgovor)
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

    function formatirajValutu(iznos) {
        if (iznos === null || iznos === undefined) {
            return '0.00 €';
        }
        return iznos.toFixed(2) + ' €';
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
        // Resetiranje odabranog radnog naloga i povezanih podataka
        setSelectedRadniNalog(null);
        setPoslovi([]);
        setTroskovi([]);
    }

    // Dohvaća poslove za radni nalog s određenom šifrom
    async function dohvatiPoslove(sifra) {
        const odgovor = await RadniNalogService.getPoslovi(sifra);
        setPoslovi(odgovor || []);
    }

    // Dohvaća troškove za radni nalog s određenom šifrom
    async function dohvatiTroskove(sifra) {
        const odgovor = await RadniNalogService.getTroskovi(sifra);
        setTroskovi(odgovor || []);
    }

    // Funkcija za odabir radnog naloga i prikaz povezanih poslova i troškova
    function selectRadniNalog(rn) {
        if (selectedRadniNalog && selectedRadniNalog.sifra === rn.sifra) {
            // Ako je kliknuti redak već odabran, poništi odabir
            setSelectedRadniNalog(null);
            setPoslovi([]);
            setTroskovi([]);
        } else {
            // Odaberi novi redak i dohvati povezane poslove i troškove
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
                    <th>Ukupni troškovi</th>
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
                            {formatirajValutu(rn.ukupniTroskovi)}
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
        
        {/* Prikaz poslova i troškova samo kada je odabran radni nalog */}
        {selectedRadniNalog && (
            <Container className="mt-4">
                {/* Tablica poslova */}
                <Row>
                    <Col>
                        <h4>Poslovi za radni nalog: {selectedRadniNalog.sifra}</h4>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Naziv</th>
                                    <th>Vrijednost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poslovi.length > 0 ? (
                                    poslovi.map((posao, index) => (
                                        <tr key={index}>
                                            <td>{posao.nazivPosla}</td>
                                            <td>{posao.vrijednost}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">Nema poslova za ovaj radni nalog</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                {/* Tablica troškova */}
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
                                            <td>{formatirajValutu(trosak.cijena)}</td>
                                            <td>{formatirajValutu(trosak.ukupno)}</td>
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
