import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function Prisustvo() {
    const navigate = useNavigate();

    const [sastanci, setSastanci] = useState([]);
    const [ucesnici, setUcesnici] = useState([]);
    const [sastanakId, setSastanakId] = useState("");
    const [poruka, setPoruka] = useState("");

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
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/" + id + "/ucesnici");
            setUcesnici(await odgovor.json());

        } catch (greska) {
            console.log("Greska pri ucitavanju ucesnika!");
        }
    }
    async function evidentiraj(korisnikId, status) {
        setPoruka("");
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/evidentiraj-prisustvo", {
                method: "POST",
                headers: { "Content-Type": "application/json",
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
            setPoruka("Uspesno evidentirao!");

        } catch (greska) {
            setPoruka("Greska u povezivanju sa serverom!");
        }

    }
    return (
        <div className="pozadina">
            <Meni/>
            <div className="kartica" style={{ width: "500px" }}>
                <h2 className="naslov"> Evidentiranje prisustva </h2>

                {/*Padajuca lista sastanaka*/}
                <select value={sastanakId}
                    onChange={(e) => {
                        setSastanakId(e.target.value);
                        ucitajUcesnike(e.target.value);
                    }}
                    className="polje"
                >
                    <option value="">--Izaberi sastanak--</option>
                    {sastanci.map((s) => (
                        <option key={s.id} value={s.id}>{s.tema}</option>
                    ))}
                </select>

                {/*Spisak ucesnika sastanka sa dugmicima */}
                <h3 className="podnaslov">Učesnici</h3>
                {ucesnici.length == 0 ? (
                    <p className="tekst">Izaberi sastanak da vidiš učesnike</p>
                ) : (
                    ucesnici.map((u) => (
                        <div key={u.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "10px",
                                padding: "8px",
                                backgroundColor: "#faf7f3",
                                borderRadius: "6px"
                            }}>
                            <span style={{ color: "#54463d" }}>
                                {u.korisnik.ime} {u.korisnik.prezime}
                            </span>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => evidentiraj(u.korisnik.id, "PRISUTAN")}
                                    className="dugme2">
                                    Prisutan
                                </button>
                                <button onClick={() => evidentiraj(u.korisnik.id, "ODSUTAN")}
                                    className="dugme2">
                                    Odsutan
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {poruka && <p
                    className="tekst"
                    style={{ textAlign: "center" }}>
                    {poruka}
                </p>}

                <button onClick={() => navigate("/dashboard")} className="dugme">Nazad</button>
            </div>
        </div>
    )
}
export default Prisustvo;