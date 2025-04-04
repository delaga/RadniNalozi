import { useEffect, useState } from "react"
import { ErrorBoundary } from 'react-error-boundary'
import RadniNalogService from "../../services/RadniNalogService"
import { Button, Table, Modal, Tabs, Tab } from "react-bootstrap";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfDocument } from '../../components/RadniNalogPDF';
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";

// PDF Button Component
function PDFButton({ radniNalog }) {
    const [loading, setLoading] = useState(false);
    const [pdfReady, setPdfReady] = useState(false);
    const [posloviData, setPosloviData] = useState([]);
    const [troskoviData, setTroskoviData] = useState([]);

    const prepareData = async () => {
        setLoading(true);
        try {
            // Fetch data for this specific radni nalog
            const poslovi = await RadniNalogService.getPoslovi(radniNalog.sifra);
            const troskovi = await RadniNalogService.getTroskovi(radniNalog.sifra);
            
            // Update state with the fetched data
            setPosloviData(poslovi || []);
            setTroskoviData(troskovi || []);
            setPdfReady(true);
        } catch (error) {
            console.error("Error fetching data for PDF:", error);
            alert("Greška pri dohvaćanju podataka za PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="secondary"
            onClick={(e) => {
                e.stopPropagation();
                if (!pdfReady) {
                    prepareData();
                }
            }}
        >
            {loading ? (
                "Učitavanje podataka..."
            ) : pdfReady ? (
                <ErrorBoundary fallback={<span>Greška pri generiranju PDF-a</span>}>
                    <PDFDownloadLink
                        document={
                            <PdfDocument 
                                radniNalog={radniNalog} 
                                poslovi={posloviData}
                                troskovi={troskoviData}
                            />
                        }
                        fileName={`RadniNalog_${radniNalog.sifra}.pdf`}
                    >
                        {({ loading: pdfLoading }) => 
                            pdfLoading ? 'Priprema PDF...' : 'Ispis kalkulacije'
                        }
                    </PDFDownloadLink>
                </ErrorBoundary>
            ) : (
                "Pripremi PDF"
            )}
        </Button>
    );
}


export function formatirajDatum(datum){
    if(datum==null){
        return 'Nije definirano'
    }
    return moment.utc(datum).format('DD. MM. YYYY. HH:mm')
}

export function formatirajValutu(iznos) {
    if (iznos === null || iznos === undefined) {
        return '0.00 €';
    }
    return iznos.toFixed(2) + ' €';
}

export default function RadniNaloziPregled(){

    // State varijable
    const[radniNalozi, setRadniNalozi] = useState(); // Lista svih radnih naloga
    const[selectedRadniNalog, setSelectedRadniNalog] = useState(null); // Trenutno odabrani radni nalog
    const[poslovi, setPoslovi] = useState([]); // Poslovi vezani za odabrani radni nalog
    const[troskovi, setTroskovi] = useState([]); // Troškovi vezani za odabrani radni nalog
    const navigate = useNavigate();
    const [showPosloviModal, setShowPosloviModal] = useState(false);

    async function dohvatiRadniNalozi(){
        const odgovor = await RadniNalogService.get()
        console.log('Radni nalozi:', odgovor)
        setRadniNalozi(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu
    useEffect(()=>{
        dohvatiRadniNalozi();
    },[])

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
        setSelectedRadniNalog(rn);
        dohvatiPoslove(rn.sifra);
        dohvatiTroskove(rn.sifra);
        setShowPosloviModal(true);
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
                    <th>Djelatnici</th>
                    <th>Klijent</th>
                    <th>Vrijeme početka</th>
                    <th>Vrijeme završetka</th>
                    <th>Radnih sati</th>
                    <th>Vrijednost radnih sati</th>
                    <th>Ukupni troškovi</th>
                    <th>Ukupno poslovi</th>
                    <th>Vrijednost radnog naloga</th>
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
                            {rn.djelatnici && rn.djelatnici.map((d, i) => (
                                <div key={i}>
                                    {d.imeIPrezime}
                                    {i < rn.djelatnici.length - 1 && <hr className="my-1" />}
                                </div>
                            ))}
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
                            {formatirajValutu(rn.vrijednostRadnihSati)}
                        </td>

                        <td>
                            {formatirajValutu(rn.ukupniTroskovi)}
                        </td>

                        <td>
                            {formatirajValutu(rn.ukupnoPoslovi)}
                        </td>

                        <td>
                            {formatirajValutu((rn.ukupniTroskovi || 0) + (rn.ukupnoPoslovi || 0) + (rn.vrijednostRadnihSati || 0))}
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
                            &nbsp;
                            <PDFButton radniNalog={rn} />
                            &nbsp;
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
        
        {/* Modali za prikaz poslova i troškova */}
        <Modal 
            show={showPosloviModal} 
            onHide={() => setShowPosloviModal(false)}
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title>Detalji radnog naloga: {selectedRadniNalog?.sifra}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="poslovi" className="mb-3">
                    <Tab eventKey="poslovi" title="Poslovi">
                        <Table striped bordered hover responsive className="mt-3">
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
                                            <td>{formatirajValutu(posao.vrijednost)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">Nema poslova za ovaj radni nalog</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="troskovi" title="Troškovi">
                        <Table striped bordered hover responsive className="mt-3">
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
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-end w-100">
                    <h4>
                        Ukupna vrijednost radnog naloga: {formatirajValutu(
                            (selectedRadniNalog?.ukupniTroskovi || 0) + 
                            (selectedRadniNalog?.ukupnoPoslovi || 0) + 
                            (selectedRadniNalog?.vrijednostRadnihSati || 0)
                        )}
                    </h4>
                </div>
            </Modal.Footer>
        </Modal>
        </>
    )
}
