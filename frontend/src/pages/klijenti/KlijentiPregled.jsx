import { useEffect, useState } from "react";
import { getKlijenti } from "../../services/KlijentService";
import { Link } from "react-router-dom";

export default function KlijentiPregled() {
    const [klijenti, setKlijenti] = useState([]);

    async function dohvatiKlijente() {
        const odgovor = await getKlijenti();
        setKlijenti(odgovor.data);
    }

    useEffect(() => {
        dohvatiKlijente();
    }, []);

    return (
        <div className="container">
            <h1>Pregled klijenata</h1>
            <Link to="/klijenti/dodaj" className="btn btn-primary">
                Dodaj klijenta
            </Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Šifra</th>
                        <th>Naziv</th>
                        <th>OIB</th>
                        <th>Adresa</th>
                        <th>Email</th>
                        <th>Odgovorna osoba</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {klijenti.map((k) => (
                        <tr key={k.sifra}>
                            <td>{k.sifra}</td>
                            <td>{k.naziv}</td>
                            <td>{k.oib}</td>
                            <td>{k.adresa}</td>
                            <td>{k.email}</td>
                            <td>{k.odgovornaOsoba}</td>
                            <td>
                                <Link
                                    to={`/klijenti/promjena/${k.sifra}`}
                                    className="btn btn-warning"
                                >
                                    Promjeni
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
