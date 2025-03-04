import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postKlijent } from "../../services/KlijentService";

export default function KlijentiDodaj() {
    const [klijent, setKlijent] = useState({
        naziv: "",
        oib: "",
        adresa: "",
        email: "",
        odgovornaOsoba: ""
    });
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setKlijent(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function dodajKlijenta(e) {
        e.preventDefault();
        try {
            await postKlijent(klijent);
            navigate("/klijenti");
        } catch (error) {
            console.error("Greška pri dodavanju klijenta:", error);
        }
    }

    return (
        <div className="container">
            <h1>Dodaj klijenta</h1>
            <form onSubmit={dodajKlijenta}>
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
                    Dodaj
                </button>
            </form>
        </div>
    );
}
