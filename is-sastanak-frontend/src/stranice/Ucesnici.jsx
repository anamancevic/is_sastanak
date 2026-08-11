import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Ucesnici() {
    const navigate = useNavigate();

    const [sastanci, setSastanci] = useState([]);
    const [ucesnici, setUcesnici] = useState([]);
    const [korisnici, setKorisnici] = useState([]);

    const [sastanakId, setSastanakId] = useState("");
    const [korisnikId, setKorisnikId] = useState("");
    const [poruka, setPoruka] = useState("");

    useEffect(() => {
        async function ucitaj() {
            try {
                const s = await fetch("http://localhost:8080/api/sastanci");
                setSastanci(await s.json());

                const k = await fetch("http://localhost:8080/api/korisnici");
                setKorisnici(await k.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju!");
            }
        }
        ucitaj();

    }, []);

    async function ucitajUcesnike(id) {
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/" + id + "/ucesnici");
            setUcesnici(await odgovor.json());
        } catch (greska) {
            console.log("Greska pri ucitavanju ucesnika!");
        }
    }
    async function dodajUcesnika() {
        setPoruka("");
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/dodaj-ucesnika", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sastanakId: sastanakId,
                    korisnikId: korisnikId
                }),
            });
            if (!odgovor.ok) {
                setPoruka("Greska pri dodavanju ucesnika!");
                return;
            }
            setPoruka("Ucesnik je dodat!");
            setKorisnikId("");
            ucitajUcesnike(sastanakId)
        } catch (greska) {
            setPoruka("Greska pri dodavanju ucesnika!");
        }
        ;
    }
    return (
        <div className="pozadina">
            <div className="kartica">
                <h2 className="naslov">
                    Ucesnici sastanka
                </h2>
                {/* padajuca lista sastanaka */}
                <select
                    value={sastanakId}
                    onChange={(e) => {
                        setSastanakId(e.target.value);
                        ucitajUcesnike(e.target.value);
                    }}
                    className="polje">
                    <option value="">--Izaberi sastanak--</option>
                    {sastanci.map((s) => (
                        <option key={s.id} value={s.id}>{s.tema}</option>
                    ))}
                </select>

                <h3 className="podnaslov">Trenutni ucesnici</h3>
                {/* spisak svih ucesnika tog sastanka */}
                {ucesnici.length == 0 ? (
                    <p className="tekst">Nema ucesnika sastanka</p>) :
                    (<ul style={{ marginBottom: "16px", paddingLeft: "20px" }}>
                        {ucesnici.map((u) => (
                            <li key={u.id} style={{ color: "#54463d", marginBottom: "4px" }}>
                                {u.korisnik.ime} {u.korisnik.prezime}
                            </li>
                        ))}
                    </ul>
                    )}
                <h3 className="podnaslov">Dodaj novog ucesnika</h3>
                {/* dodavanje novog ucesnika*/}
                <select value={korisnikId}
                    onChange={(e) => setKorisnikId(e.target.value)}
                    className="polje">
                    <option value="">-- Izaberi korisnika --</option>
                    {korisnici.map((k) => (
                        <option key={k.id} value={k.id}>
                            {k.ime} {k.prezime}
                        </option>
                    ))}
                </select>

                <button onClick={dodajUcesnika}
                    className="dugme"> Dodaj učesnika</button>

                {poruka && (
                    <p className="tekst">{poruka}</p>
                )}

                <button onClick={() => navigate("/dashboard")}
                    className="dugme">
                    Nazad
                </button>
            </div>

        </div>
    )

}
export default Ucesnici;