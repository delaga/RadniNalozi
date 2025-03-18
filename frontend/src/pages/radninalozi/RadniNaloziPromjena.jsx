import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import RadniNalogService from "../../services/RadniNalogService";
import { useEffect, useState } from "react";
import DjelatnikService from "../../services/DjelatnikService";
import KlijentService from "../../services/KlijentService";
import PosaoService from "../../services/PosaoService";
import TrosakService from "../../services/TrosakService";
import moment from "moment";


export default function RadniNaloziPromjena(){

    const navigate = useNavigate();
    const [radniNalog, setRadniNalog] = useState({});
    const [djelatnici, setDjelatnici] = useState([]);
    const [klijenti, setKlijenti] = useState([]);
    const [poslovi, setPoslovi] = useState([]);
    const [troskovi, setTroskovi] = useState([]);
    const [odabraniPosao, setOdabraniPosao] = useState('');
    const [odabraniTrosak, setOdabraniTrosak] = useState('');
    const [kolicinaTrosak, setKolicinaTrosak] = useState(1);
    const [dodaniPoslovi, setDodaniPoslovi] = useState([]);
    const [dodaniTroskovi, setDodaniTroskovi] = useState([]);
    const [postojeciPoslovi, setPostojeciPoslovi] = useState([]);
    const [postojeciTroskovi, setPostojeciTroskovi] = useState([]);
    const routeParams = useParams();

    async function dohvatiRadniNalog(){
        const odgovor = await RadniNalogService.getBySifra(routeParams.sifra);
        
        // Format dates for the datetime-local input if they exist
        if(odgovor.vrijemePocetka) {
            odgovor.vrijemePocetkaFormatirano = moment.utc(odgovor.vrijemePocetka).format('YYYY-MM-DDTHH:mm');
        }
        if(odgovor.vrijemeZavrsetka) {
            odgovor.vrijemeZavrsetkaFormatirano = moment.utc(odgovor.vrijemeZavrsetka).format('YYYY-MM-DDTHH:mm');
        }
        
        setRadniNalog(odgovor);
    }

    async function dohvatiDjelatnici(){
        const odgovor = await DjelatnikService.get();
        setDjelatnici(odgovor);
    }

    async function dohvatiKlijenti(){
        const odgovor = await KlijentService.get();
        setKlijenti(odgovor);
    }

    async function dohvatiPoslovi(){
        const odgovor = await PosaoService.get();
        setPoslovi(odgovor);
    }

    async function dohvatiTroskovi(){
        const odgovor = await TrosakService.get();
        setTroskovi(odgovor);
    }

    async function dohvatiPostojecePoslove(){
        const odgovor = await RadniNalogService.getPoslovi(routeParams.sifra);
        setPostojeciPoslovi(odgovor || []);
    }

    async function dohvatiPostojeceTroskove(){
        const odgovor = await RadniNalogService.getTroskovi(routeParams.sifra);
        setPostojeciTroskovi(odgovor || []);
    }

    useEffect(()=>{
        dohvatiRadniNalog();
        dohvatiDjelatnici();
        dohvatiKlijenti();
        dohvatiPoslovi();
        dohvatiTroskovi();
        dohvatiPostojecePoslove();
        dohvatiPostojeceTroskove();
    },[]);

    function dodajPosao() {
        if (!odabraniPosao) return;
        
        const posao = poslovi.find(p => p.sifra === parseInt(odabraniPosao));
        if (!posao) return;
        
        const noviPosao = {
            sifra: posao.sifra,
            naziv: posao.nazivPosla,
            vrijednost: posao.vrijednost
        };
        
        setDodaniPoslovi([...dodaniPoslovi, noviPosao]);
        setOdabraniPosao('');
    }

    function dodajTrosak() {
        if (!odabraniTrosak) return;
        
        const trosak = troskovi.find(t => t.sifra === parseInt(odabraniTrosak));
        if (!trosak) return;
        
        const noviTrosak = {
            sifra: trosak.sifra,
            naziv: trosak.naziv,
            kolicina: kolicinaTrosak,
            vrsta: trosak.vrsta,
            vrstaNaziv: trosak.vrstaNaziv,
            cijena: trosak.cijena
        };
        
        setDodaniTroskovi([...dodaniTroskovi, noviTrosak]);
        setOdabraniTrosak('');
        setKolicinaTrosak(1);
    }

    function ukloniPosao(sifra) {
        setDodaniPoslovi(dodaniPoslovi.filter(p => p.sifra !== sifra));
    }

    function ukloniTrosak(sifra) {
        setDodaniTroskovi(dodaniTroskovi.filter(t => t.sifra !== sifra));
    }

    async function promjena(radniNalog){
        try {
            // Prvo ažuriramo radni nalog
            const odgovor = await RadniNalogService.promjena(routeParams.sifra, radniNalog);
            if(odgovor.greska){
                alert(odgovor.poruka);
                return;
            }

            // Dodavanje novih poslova na radni nalog
            let uspjesnoDodaniPoslovi = 0;
            for (const posao of dodaniPoslovi) {
                try {
                    const rezultat = await RadniNalogService.dodajPosao(routeParams.sifra, posao.sifra);
                    if (rezultat && !rezultat.greska) {
                        uspjesnoDodaniPoslovi++;
                    } else if (rezultat && rezultat.greska) {
                        console.error("Greška kod dodavanja posla:", rezultat.poruka);
                    }
                } catch (error) {
                    console.error("Greška kod dodavanja posla:", error);
                }
            }

            // Dodavanje novih troškova na radni nalog
            let uspjesnoDodaniTroskovi = 0;
            for (const trosak of dodaniTroskovi) {
                try {
                    const rezultat = await RadniNalogService.dodajTrosak(routeParams.sifra, trosak.sifra, trosak.kolicina);
                    if (rezultat && !rezultat.greska) {
                        uspjesnoDodaniTroskovi++;
                    } else if (rezultat && rezultat.greska) {
                        console.error("Greška kod dodavanja troška:", rezultat.poruka);
                    }
                } catch (error) {
                    console.error("Greška kod dodavanja troška:", error);
                }
            }

            // Prikaži poruku o uspjehu
            if (dodaniPoslovi.length > 0 || dodaniTroskovi.length > 0) {
                let poruka = "Radni nalog je ažuriran.";
                if (uspjesnoDodaniPoslovi > 0) {
                    poruka += ` Dodano ${uspjesnoDodaniPoslovi} od ${dodaniPoslovi.length} poslova.`;
                }
                if (uspjesnoDodaniTroskovi > 0) {
                    poruka += ` Dodano ${uspjesnoDodaniTroskovi} od ${dodaniTroskovi.length} troškova.`;
                }
                alert(poruka);
            } else {
                alert("Radni nalog je uspješno ažuriran.");
            }

            navigate(RouteNames.RADNINALOG_PREGLED);
        } catch (error) {
            console.error("Greška kod ažuriranja radnog naloga:", error);
            alert("Došlo je do greške prilikom ažuriranja radnog naloga.");
        }
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        const updatedRadniNalog = {
            djelatnik: parseInt(podaci.get('djelatnik')),
            klijent: parseInt(podaci.get('klijent')),
            vrijemePocetka: podaci.get('vrijemePocetka') ? new Date(podaci.get('vrijemePocetka')).toISOString() : null,
            vrijemeZavrsetka: podaci.get('vrijemeZavrsetka') ? new Date(podaci.get('vrijemeZavrsetka')).toISOString() : null,
            radnihSati: podaci.get('radnihSati') ? parseFloat(podaci.get('radnihSati')) : null,
            napomena: podaci.get('napomena').trim() === '' ? null : podaci.get('napomena').trim(),
            poslovi: dodaniPoslovi.map(p => ({ 
                sifra: p.sifra
            })),
            troskovi: dodaniTroskovi.map(t => ({ 
                sifra: t.sifra, 
                kolicina: t.kolicina 
            }))
        };

        promjena(updatedRadniNalog);
    }

    return(
    <>
    Promjena Radnog naloga
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="djelatnik">
            <Form.Label>Djelatnik</Form.Label>
            <Form.Select name="djelatnik" required defaultValue={radniNalog.djelatnik}>
                <option value="">Odaberite djelatnika</option>
                {djelatnici && djelatnici.map((d,index)=>(
                    <option key={index} value={d.sifra}>{d.ime} {d.prezime}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="klijent">
            <Form.Label>Klijent</Form.Label>
            <Form.Select name="klijent" required defaultValue={radniNalog.klijent}>
                <option value="">Odaberite klijenta</option>
                {klijenti && klijenti.map((k,index)=>(
                    <option key={index} value={k.sifra}>{k.naziv}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="vrijemePocetka">
            <Form.Label>Vrijeme početka</Form.Label>
            <Form.Control 
                type="datetime-local" 
                name="vrijemePocetka" 
                defaultValue={radniNalog.vrijemePocetkaFormatirano} 
            />
        </Form.Group>

        <Form.Group controlId="vrijemeZavrsetka">
            <Form.Label>Vrijeme završetka</Form.Label>
            <Form.Control 
                type="datetime-local" 
                name="vrijemeZavrsetka" 
                defaultValue={radniNalog.vrijemeZavrsetkaFormatirano} 
            />
        </Form.Group>

        <Form.Group controlId="radnihSati">
            <Form.Label>Radnih sati</Form.Label>
            <Form.Control 
                type="number" 
                name="radnihSati" 
                step={0.1} 
                defaultValue={radniNalog.radnihSati} 
            />
        </Form.Group>

        <Form.Group controlId="napomena">
            <Form.Label>Napomena</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={3} 
                name="napomena" 
                defaultValue={radniNalog.napomena} 
            />
        </Form.Group>

        <hr/>

        {/* Postojeći poslovi */}
        <h4>Postojeći poslovi</h4>
        {postojeciPoslovi.length > 0 ? (
            <div className="mb-3">
                <ul className="list-group">
                    {postojeciPoslovi.map((p, index) => (
                        <li key={index} className="list-group-item">
                            {p.nazivPosla} - Vrijednost: {p.vrijednost}
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <p>Nema postojećih poslova za ovaj radni nalog</p>
        )}

        {/* Dodavanje poslova */}
        <h4>Dodavanje poslova</h4>
        <Row className="mb-3">
            <Col md={8}>
                <Form.Group controlId="odabirPosla">
                    <Form.Label>Odaberi posao</Form.Label>
                    <Form.Select 
                        value={odabraniPosao} 
                        onChange={(e) => setOdabraniPosao(e.target.value)}
                    >
                        <option value="">Odaberite posao</option>
                        {poslovi && poslovi.map((p, index) => (
                            <option key={index} value={p.sifra}>{p.nazivPosla}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" onClick={dodajPosao} className="mb-3">
                    Dodaj
                </Button>
            </Col>
        </Row>

        {/* Prikaz dodanih poslova */}
        {dodaniPoslovi.length > 0 && (
            <div className="mb-3">
                <h5>Novi poslovi za dodati:</h5>
                <ul className="list-group">
                    {dodaniPoslovi.map((p, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {p.naziv}
                            <Button variant="danger" size="sm" onClick={() => ukloniPosao(p.sifra)}>
                                Ukloni
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <hr/>

        {/* Postojeći troškovi */}
        <h4>Postojeći troškovi</h4>
        {postojeciTroskovi.length > 0 ? (
            <div className="mb-3">
                <ul className="list-group">
                    {postojeciTroskovi.map((t, index) => (
                        <li key={index} className="list-group-item">
                            {t.naziv} ({t.vrstaNaziv}) - Količina: {t.kolicina}, Cijena: {t.cijena} €, Ukupno: {t.ukupno} €
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <p>Nema postojećih troškova za ovaj radni nalog</p>
        )}

        {/* Dodavanje troškova */}
        <h4>Dodavanje troškova</h4>
        <Row className="mb-3">
            <Col md={6}>
                <Form.Group controlId="odabirTroska">
                    <Form.Label>Odaberi trošak</Form.Label>
                    <Form.Select 
                        value={odabraniTrosak} 
                        onChange={(e) => setOdabraniTrosak(e.target.value)}
                    >
                        <option value="">Odaberite trošak</option>
                        {troskovi && troskovi.map((t, index) => (
                            <option key={index} value={t.sifra}>{t.naziv} ({t.vrstaNaziv})</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group controlId="kolicinaTroska">
                    <Form.Label>Količina</Form.Label>
                    <Form.Control 
                        type="number" 
                        min="1" 
                        value={kolicinaTrosak} 
                        onChange={(e) => setKolicinaTrosak(parseInt(e.target.value))} 
                    />
                </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" onClick={dodajTrosak} className="mb-3">
                    Dodaj
                </Button>
            </Col>
        </Row>

        {/* Prikaz dodanih troškova */}
        {dodaniTroskovi.length > 0 && (
            <div className="mb-3">
                <h5>Novi troškovi za dodati:</h5>
                <ul className="list-group">
                    {dodaniTroskovi.map((t, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {t.naziv} ({t.vrstaNaziv}) - Količina: {t.kolicina}
                            <Button variant="danger" size="sm" onClick={() => ukloniTrosak(t.sifra)}>
                                Ukloni
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.RADNINALOG_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Promjeni Radni nalog
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
