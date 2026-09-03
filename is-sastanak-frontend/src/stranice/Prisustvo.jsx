import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function Prisustvo() {
    const navigate = useNavigate();

    const [sastanci, setSastanci] = useState([]);
    const [ucesnici, setUcesnici] = useState([]);
    const [sastanakId, setSastanakId] = useState("");
    const [poruka, setPoruka] = useState("");

    const [evidencija, setEvidencija] = useState({});

    useEffect(() => {
        async function ucitaj() {
            try {
                const s = await fetch("http://localhost:8080/api/sastanci");
                setSastanci(await s.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju!");
            }
        }
        ucitaj();
    }, []);

    async function ucitajUcesnike(id) {
        if (id === "") {
            setUcesnici([]);
            setEvidencija({});
            return;
        }

        try {
            const odgovorUcesnici = await fetch(
                "http://localhost:8080/api/sastanci/" + id + "/ucesnici"
            );

            const podaciUcesnici = await odgovorUcesnici.json();
            setUcesnici(podaciUcesnici);

            const odgovorPrisustvo = await fetch(
                "http://localhost:8080/api/sastanci/" + id + "/prisustvo"
            );

            const podaciPrisustvo = await odgovorPrisustvo.json();

            const evidentiraniStatusi = {};

            podaciPrisustvo.forEach((p) => {
                if (p.korisnik) {
                    evidentiraniStatusi[p.korisnik.id] = p.status;
                }
            });

            setEvidencija(evidentiraniStatusi);
        } catch (greska) {
            console.log("Greška pri učitavanju učesnika i prisustva!");
        }
    }
    async function evidentiraj(korisnikId, status) {
        setPoruka("");
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/evidentiraj-prisustvo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Korisnik": korisnik.korisnickoIme
                },
                body: JSON.stringify({
                    sastanakId: sastanakId,
                    korisnikId: korisnikId,
                    status: status
                }),
            });
            if (!odgovor.ok) {
                setPoruka("Greska pri evidentiranju!");
                return;
            }
            setEvidencija((prethodnaEvidencija) => ({
                ...prethodnaEvidencija,
                [korisnikId]: status
            }));
            setPoruka("Uspesno evidentirao!");

        } catch (greska) {
            setPoruka("Greska u povezivanju sa serverom!");
        }

    }
    return (
        <div className="pozadina">
            <Meni />
            <div className="korisnici-sadrzaj">
                <h2 className="naslov">
                    Evidentiranje prisustva
                </h2>
                <div className="korisnici-forma">
                    <div>
                        <h3
                            className="podnaslov"
                            style={{ fontSize: "20px", marginBottom: "20px" }}>
                            Izaberite sastanak
                        </h3>
                        <select
                            value={sastanakId}
                            onChange={(e) => {
                                setSastanakId(e.target.value);
                                if (e.target.value !== "") {
                                    ucitajUcesnike(e.target.value);
                                } else {
                                    setUcesnici([]);
                                }
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
                        <p className="tekst">
                            Izaberite sastanak, a zatim za svakog učesnika evidentirajte da li je prisutan ili odsutan.
                        </p>
                    </div>
                    <div>
                        <h3
                            className="podnaslov"
                            style={{ fontSize: "20px", marginBottom: "20px" }}>
                            Učesnici sastanka
                        </h3>
                        {ucesnici.length === 0 ? (
                            <p className="tekst">
                                Izaberite sastanak da biste videli učesnike.
                            </p>
                        ) : (
                            ucesnici.map((u) => (
                                <div
                                    key={u.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "15px",
                                        padding: "15px 0",
                                        borderBottom: "1px solid #eeeaf5"
                                    }}>
                                    <span
                                        className="tekst"
                                        style={{
                                            marginBottom: "0",
                                            fontWeight: "600"
                                        }}>
                                        {u.korisnik.ime} {u.korisnik.prezime}
                                    </span>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => evidentiraj(u.korisnik.id, "PRISUTAN")}
                                            className="dugme2"
                                            disabled={evidencija[u.korisnik.id] === "PRISUTAN"}
                                            style={{
                                                opacity: evidencija[u.korisnik.id] === "PRISUTAN" ? 0.45 : 1,
                                                cursor: evidencija[u.korisnik.id] === "PRISUTAN" ? "not-allowed" : "pointer"
                                            }}>
                                            Prisutan
                                        </button>

                                        <button
                                            onClick={() => evidentiraj(u.korisnik.id, "ODSUTAN")}
                                            className="dugme2"
                                            disabled={evidencija[u.korisnik.id] === "ODSUTAN"}
                                            style={{
                                                opacity: evidencija[u.korisnik.id] === "ODSUTAN" ? 0.45 : 1,
                                                cursor: evidencija[u.korisnik.id] === "ODSUTAN" ? "not-allowed" : "pointer"
                                            }}>
                                            Odsutan
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
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
export default Prisustvo;