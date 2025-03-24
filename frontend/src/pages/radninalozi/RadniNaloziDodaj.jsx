import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import RadniNalogService from "../../services/RadniNalogService";
import { useEffect, useState } from "react";
import DjelatnikService from "../../services/DjelatnikService";
import KlijentService from "../../services/KlijentService";
import PosaoService from "../../services/PosaoService";
import TrosakService from "../../services/TrosakService";
import VrstaTroskaService from "../../services/VrstaTroskaService";


export default function RadniNaloziDodaj(){

    const navigate = useNavigate();
    const [djelatnici, setDjelatnici] = useState([]);
    const [klijenti, setKlijenti] = useState([]);
    const [poslovi, setPoslovi] = useState([]);
    const [vrsteTroskova, setVrsteTroskova] = useState([]);
    const [odabraniDjelatnik, setOdabraniDjelatnik] = useState('');
    const [odabraniPosao, setOdabraniPosao] = useState('');
    const [odabranaVrstaTroska, setOdabranaVrstaTroska] = useState('');
    const [nazivTroska, setNazivTroska] = useState('');
    const [kolicinaTrosak, setKolicinaTrosak] = useState(1);
    const [cijenaTrosak, setCijenaTrosak] = useState(0);
    const [dodaniDjelatnici, setDodaniDjelatnici] = useState([]);
    const [dodaniPoslovi, setDodaniPoslovi] = useState([]);
    const [dodaniTroskovi, setDodaniTroskovi] = useState([]);

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

    async function dohvatiVrsteTroskova(){
        const odgovor = await VrstaTroskaService.get();
        setVrsteTroskova(odgovor);
    }

    useEffect(()=>{
        dohvatiDjelatnici();
        dohvatiKlijenti();
        dohvatiPoslovi();
        dohvatiVrsteTroskova();
    },[]);

    function dodajDjelatnik() {
        if (!odabraniDjelatnik) return;
        
        const djelatnik = djelatnici.find(d => d.sifra === parseInt(odabraniDjelatnik));
        if (!djelatnik) return;
        
        // Provjeri da li je djelatnik već dodan
        if (dodaniDjelatnici.some(d => d.sifra === djelatnik.sifra)) {
            alert("Djelatnik je već dodan na radni nalog.");
            return;
        }
        
        const noviDjelatnik = {
            sifra: djelatnik.sifra,
            ime: djelatnik.ime,
            prezime: djelatnik.prezime
        };
        
        setDodaniDjelatnici([...dodaniDjelatnici, noviDjelatnik]);
        setOdabraniDjelatnik('');
    }

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
        if (!odabranaVrstaTroska || !nazivTroska || kolicinaTrosak <= 0) {
            alert("Molimo popunite sva polja za trošak.");
            return;
        }
        
        const vrstaTroska = vrsteTroskova.find(vt => vt.sifra === parseInt(odabranaVrstaTroska));
        if (!vrstaTroska) return;
        
        const noviTrosak = {
            naziv: nazivTroska,
            kolicina: kolicinaTrosak,
            vrsta: parseInt(odabranaVrstaTroska),
            cijena: cijenaTrosak
        };
        
        setDodaniTroskovi([...dodaniTroskovi, noviTrosak]);
        setOdabranaVrstaTroska('');
        setNazivTroska('');
        setKolicinaTrosak(1);
        setCijenaTrosak(0);
    }

    function ukloniDjelatnik(sifra) {
        setDodaniDjelatnici(dodaniDjelatnici.filter(d => d.sifra !== sifra));
    }

    function ukloniPosao(sifra) {
        setDodaniPoslovi(dodaniPoslovi.filter(p => p.sifra !== sifra));
    }

    function ukloniTrosak(sifra) {
        setDodaniTroskovi(dodaniTroskovi.filter(t => t.sifra !== sifra));
    }

    async function dodaj(radniNalog){
        // Prvo dodajemo radni nalog
        const odgovor = await RadniNalogService.dodaj(radniNalog);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
/*
        // Ako imamo dodane poslove, dodajemo ih na radni nalog
        const radniNalogSifra = odgovor.sifra || odgovor.data?.sifra;
        if (radniNalogSifra) {
            // Dodavanje poslova na radni nalog
            for (const posao of dodaniPoslovi) {
                try {
                    await RadniNalogService.dodajPosao(radniNalogSifra, posao.sifra);
                } catch (error) {
                    console.error("Greška kod dodavanja posla:", error);
                }
            }

            // Dodavanje troškova na radni nalog
            for (const trosak of dodaniTroskovi) {
                try {
                    const noviTrosak = {
                        naziv: trosak.naziv,
                        vrsta: trosak.vrsta,
                        radniNalog: radniNalogSifra,
                        kolicina: trosak.kolicina,
                        cijena: trosak.cijena
                    };
                    await TrosakService.dodaj(noviTrosak);
                } catch (error) {
                    console.error("Greška kod dodavanja troška:", error);
                }
            }
        }
*/
        navigate(RouteNames.RADNINALOG_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        const radniNalog = {
            djelatniciLista: dodaniDjelatnici.map(d => ({ 
                sifra: d.sifra
            })),
            klijentSifra: parseInt(podaci.get('klijent')),
            vrijemePocetka: podaci.get('vrijemePocetka') ? new Date(podaci.get('vrijemePocetka')).toISOString() : null,
            vrijemeZavrsetka: podaci.get('vrijemeZavrsetka') ? new Date(podaci.get('vrijemeZavrsetka')).toISOString() : null,
            radnihSati: podaci.get('radnihSati') ? parseFloat(podaci.get('radnihSati')) : null,
            napomena: podaci.get('napomena').trim() === '' ? null : podaci.get('napomena').trim(),
            posloviLista: dodaniPoslovi.map(p => ({ 
                sifra: p.sifra
            })),
            troskoviLista: dodaniTroskovi.map(t => ({
                naziv: t.naziv,
                vrsta: t.vrsta,
                radniNalog: 0, // This will be set by the backend
                kolicina: t.kolicina,
                cijena: t.cijena
            }))
        };

        dodaj(radniNalog);
    }

    return(
    <>
    Dodavanje Radnog naloga
    <Form onSubmit={odradiSubmit}>

        {/* Dodavanje djelatnika */}
        <h4>Dodavanje djelatnika</h4>
        <Row className="mb-3">
            <Col md={8}>
                <Form.Group controlId="odabirDjelatnika">
                    <Form.Label>Odaberi djelatnika</Form.Label>
                    <Form.Select 
                        value={odabraniDjelatnik} 
                        onChange={(e) => setOdabraniDjelatnik(e.target.value)}
                    >
                        <option value="">Odaberite djelatnika</option>
                        {djelatnici && djelatnici.map((d, index) => (
                            <option key={index} value={d.sifra}>{d.ime} {d.prezime}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" onClick={dodajDjelatnik} className="mb-3">
                    Dodaj
                </Button>
            </Col>
        </Row>

        {/* Prikaz dodanih djelatnika */}
        {dodaniDjelatnici.length > 0 ? (
            <div className="mb-3">
                <h5>Dodani djelatnici:</h5>
                <ul className="list-group">
                    {dodaniDjelatnici.map((d, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {d.ime} {d.prezime}
                            <Button variant="danger" size="sm" onClick={() => ukloniDjelatnik(d.sifra)}>
                                Ukloni
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <div className="alert alert-warning mb-3">
                Morate dodati barem jednog djelatnika na radni nalog.
            </div>
        )}

        <hr/>

        <Form.Group controlId="klijent">
            <Form.Label>Klijent</Form.Label>
            <Form.Select name="klijent" required>
                <option value="">Odaberite klijenta</option>
                {klijenti && klijenti.map((k,index)=>(
                    <option key={index} value={k.sifra}>{k.naziv}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <Form.Group controlId="vrijemePocetka">
            <Form.Label>Vrijeme početka</Form.Label>
            <Form.Control type="datetime-local" name="vrijemePocetka" />
        </Form.Group>

        <Form.Group controlId="vrijemeZavrsetka">
            <Form.Label>Vrijeme završetka</Form.Label>
            <Form.Control type="datetime-local" name="vrijemeZavrsetka" />
        </Form.Group>

        <Form.Group controlId="radnihSati">
            <Form.Label>Radnih sati</Form.Label>
            <Form.Control type="number" name="radnihSati" step={0.1} />
        </Form.Group>

        <Form.Group controlId="napomena">
            <Form.Label>Napomena</Form.Label>
            <Form.Control as="textarea" rows={3} name="napomena" />
        </Form.Group>

        <hr/>
        
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
                <h5>Dodani poslovi:</h5>
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

        {/* Dodavanje troškova */}
        <h4>Dodavanje troškova</h4>
        <Row className="mb-3">
            <Col md={6}>
                <Form.Group controlId="odabirVrsteTroska">
                    <Form.Label>Vrsta troška</Form.Label>
                    <Form.Select 
                        value={odabranaVrstaTroska} 
                        onChange={(e) => setOdabranaVrstaTroska(e.target.value)}
                    >
                        <option value="">Odaberite vrstu troška</option>
                        {vrsteTroskova && vrsteTroskova.map((vt, index) => (
                            <option key={index} value={vt.sifra}>{vt.naziv}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col md={12}>
                <Form.Group controlId="nazivTroska">
                    <Form.Label>Naziv troška</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={nazivTroska} 
                        onChange={(e) => setNazivTroska(e.target.value)} 
                    />
                </Form.Group>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col md={6}>
                <Form.Group controlId="kolicinaTroska">
                    <Form.Label>Količina</Form.Label>
                    <Form.Control 
                        type="number" 
                        step="0.01"
                        value={kolicinaTrosak} 
                        onChange={(e) => setKolicinaTrosak(parseFloat(e.target.value))} 
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group controlId="cijenaTroska">
                    <Form.Label>Cijena</Form.Label>
                    <Form.Control 
                        type="number" 
                        step="0.01"
                        value={cijenaTrosak} 
                        onChange={(e) => setCijenaTrosak(parseFloat(e.target.value))} 
                    />
                </Form.Group>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col md={12} className="d-flex justify-content-end">
                <Button variant="primary" onClick={dodajTrosak} className="mb-3">
                    Dodaj trošak
                </Button>
            </Col>
        </Row>

        {/* Prikaz dodanih troškova */}
        {dodaniTroskovi.length > 0 && (
            <div className="mb-3">
                <h5>Dodani troškovi:</h5>
                <ul className="list-group">
                    {dodaniTroskovi.map((t, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {t.naziv} ({t.vrstaNaziv}) - Količina: {t.kolicina}, Cijena: {t.cijena} €, Ukupno: {(t.kolicina * t.cijena).toFixed(2)} €
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
                    Dodaj Radni nalog
                </Button>
            </Col>
        </Row>
    </Form>
    </>
    )
}
