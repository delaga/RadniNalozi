import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getKlijentBySifra, putKlijent } from "../../services/KlijentService";

export default function KlijentiPromjena() {
    const [klijent, setKlijent] = useState({
        naziv: "",
        oib: "",
        adresa: "",
        email: "",
        odgovornaOsoba: ""
    });
    const { sifra } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function dohvatiKlijenta() {
            try {
                const odgovor = await getKlijentBySifra(sifra);
                setKlijent(odgovor.data);
            } catch (error) {
                console.error("Greška pri dohvaćanju klijenta:", error);
            }
        }
        dohvatiKlijenta();
    }, [sifra]);

    function handleChange(e) {
        const { name, value } = e.target;
        setKlijent(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function promjeniKlijenta(e) {
        e.preventDefault();
        try {
            await putKlijent(sifra, klijent);
            navigate("/klijenti");
        } catch (error) {
            console.error("Greška pri promjeni klijenta:", error);
        }
    }

    return (
        <div className="container">
            <h1>Promjeni klijenta</h1>
            <form onSubmit={promjeniKlijenta}>
                <div className="form-group">
                    <label>Naziv</label>
                    <input
                        type="text"
                        name="naziv"
                        value={klijent.naziv}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>OIB</label>
                    <input
                        type="text"
                        name="oib"
                        value={klijent.oib}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Adresa</label>
                    <input
                        type="text"
                        name="adresa"
                        value={klijent.adresa}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={klijent.email}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Odgovorna osoba</label>
                    <input
                        type="text"
                        name="odgovornaOsoba"
                        value={klijent.odgovornaOsoba}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Spremi promjene
                </button>
            </form>
        </div>
    );
}
