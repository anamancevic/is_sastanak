import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";


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

    function proveraUnosa() {
        if (sastanakId === "") return "Morate izabrati sastanak!";
        if (korisnikId === "") return "Morate izabrati korisnika koji je učesnik!";
        return "";
    }

    async function dodajUcesnika() {
        setPoruka("");
        const greska = proveraUnosa();
        if (greska !== "") {
            setPoruka(greska);
            return;
        }
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/dodaj-ucesnika", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Korisnik": korisnik.korisnickoIme
                },
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
            <Meni />
            <div className="korisnici-sadrzaj">
                <h2 className="naslov">
                    Učesnici sastanka
                </h2>
                <h3
                    className="podnaslov"
                    style={{ fontSize: "20px", marginBottom: "12px" }}>
                    Izaberite sastanak
                </h3>
                <select
                    value={sastanakId}
                    onChange={(e) => {
                        setSastanakId(e.target.value);
                        ucitajUcesnike(e.target.value);
                    }}
                    className="polje">
                    <option value="">
                        -- Izaberi sastanak --
                    </option>
                    {sastanci.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.tema}
                        </option>
                    ))}
                </select>
                <div className="korisnici-forma">
                    <div>
                        <h3
                            className="podnaslov"
                            style={{ fontSize: "20px", marginBottom: "20px" }}>
                            Trenutni učesnici
                        </h3>
                        {ucesnici.length === 0 ? (
                            <p className="tekst">
                                Nema učesnika sastanka.
                            </p>
                        ) : (
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: "0",
                                    margin: "0"
                                }}>
                                {ucesnici.map((u) => (
                                    <li
                                        key={u.id}
                                        style={{
                                            padding: "14px 0",
                                            borderBottom: "1px solid #eeeaf5",
                                            color: "#5f576c",
                                            fontSize: "15px"
                                        }}>
                                        {u.korisnik.ime} {u.korisnik.prezime}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h3
                            className="podnaslov"
                            style={{ fontSize: "20px", marginBottom: "20px" }}>
                            Dodaj novog učesnika
                        </h3>
                        <select
                            value={korisnikId}
                            onChange={(e) => setKorisnikId(e.target.value)}
                            className="polje">
                            <option value="">
                                -- Izaberi korisnika --
                            </option>
                            {korisnici.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.ime} {k.prezime}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={dodajUcesnika}
                            className="dugme"
                            style={{ width: "auto" }}>
                            Dodaj učesnika
                        </button>
                    </div>
                </div>
                <div className="korisnici-dugmad">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="dugme2">
                        Nazad
                    </button>
                </div>
                {poruka && (
                    <p className="tekst">
                        {poruka}
                    </p>
                )}
            </div>
        </div>
    );

}
export default Ucesnici;