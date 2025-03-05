import { useEffect, useState } from "react";
import KlijentService from "../../services/KlijentService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function KlijentiPregled() {
    const [klijenti, setKlijenti] = useState([]);
    const navigate = useNavigate();

    async function dohvatiKlijente() {
        const odgovor = await KlijentService.get();
        setKlijenti(odgovor);
    }

    useEffect(() => {
        dohvatiKlijente();
    }, []);

    function obrisi(sifra) {
        if (!confirm('Sigurno obrisati')) {
            return;
        }
        brisanjeKlijenta(sifra);
    }

    async function brisanjeKlijenta(sifra) {
        const odgovor = await KlijentService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        dohvatiKlijente();
    }

    return (
        <>
        <Link
        to={RouteNames.KLIJENT_NOVI}
        className="btn btn-success siroko"
        >Dodaj novog klijenta</Link>
        <hr />
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Naziv</th>
                    <th>OIB</th>
                    <th>Adresa</th>
                    <th>Email</th>
                    <th>Odgovorna osoba</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {klijenti && klijenti.map((k, index) => (
                    <tr key={index}>
                        <td>{k.naziv}</td>
                        <td>{k.oib}</td>
                        <td>{k.adresa}</td>
                        <td>{k.email}</td>
                        <td>{k.odgovornaOsoba}</td>
                        <td>
                            <Button
                            onClick={() => navigate(RouteNames.KLIJENT_PROMJENA + '/' + k.sifra)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={() => obrisi(k.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}
