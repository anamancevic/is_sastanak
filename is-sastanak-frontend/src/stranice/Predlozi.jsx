import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function TackaSaPredlozima({tacka, sastanakId, ucesnici}) {
    const [predlozi, setPredlozi] = useState([]);
    const [tekst, setTekst] = useState("");
    const [korisnikId, setKorisnikId] = useState("");
    const[poruka, setPoruka] = useState("");

    async function ucitajPredloge() {
        try {
            const odgovor = await fetch("http://localhost:8080/api/predlozi/tacka/" + tacka.id);
            setPredlozi(await odgovor.json());
        } catch (greska) {
            console.log("Greska pri ucitavanju predloga!");
        }
    }

    useEffect(() => {
        ucitajPredloge();
    }, []);

function proveraUnosa() {
    if(korisnikId === "") return "Izaberite korisnika koji daje predlog!";
    if(tekst.trim() === "") return "Morate uneti tekst predloga!";
    return "";
}

    async function dodajPredlog() {
        setPoruka("");
        const greska = proveraUnosa();
        if (greska !== "") {
            setPoruka(greska);
            return;
        }
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/predlozi", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    "X-Korisnik": korisnik.korisnickoIme
                 },
                body: JSON.stringify({
                    sastanakId: sastanakId,
                    tackaId: tacka.id,
                    korisnikId: korisnikId,
                    tekst: tekst
                }),
            });
            if (!odgovor.ok) {
                return
            }
            setTekst("");
            setKorisnikId("");
            ucitajPredloge();
        } catch (greska) {
            console.log("Greska pri dodavanju predloga!");
        }
    }
    return (
        <div className="tacka-kartica">
            <h3 className="podnaslov">{tacka.redniBroj}. {tacka.sadrzaj}</h3>

            {/* postojeći predlozi */}
            {predlozi.length === 0 ? (
                <p style={{ color: "#8a8078", fontSize: "14px" }}>Nema predloga.</p>
            ) : (
                <ul style={{ paddingLeft: "20px" }}>
                    {predlozi.map((p) => (
                        <li key={p.id} style={{ color: "#54463d", marginBottom: "4px" }}>
                            {p.tekst} {p.korisnik ? "(" + p.korisnik.ime + ")" : ""}
                        </li>
                    ))}
                </ul>
            )}

            {/* dodavanje novog predloga */}
                <div className="predlog-red">
                    {/*Padajuca lista ucesnika na sastanku */}
                    <select
                        value={korisnikId}
                        onChange={(e) => setKorisnikId(e.target.value)}
                        className="polje"
                        style={{ marginBottom: 0, flex: 1 }}>
                        <option value="">--Ko daje predlog--</option>
                        {ucesnici.map((u) => (
                            <option key={u.id} value={u.korisnik.id}>
                                {u.korisnik.ime} {u.korisnik.prezime}
                            </option>
                        ))}
                    </select>

                    {/*Tekst za unos novog predloga*/}
                    <input
                        type="text"
                        placeholder="Novi predlog"
                        value={tekst}
                        onChange={(e) => setTekst(e.target.value)}
                        className="polje"
                        style={{ marginBottom: 0, flex: 1 }} />

                    <button onClick={dodajPredlog}
                        className="dugme"
                        style={{ width: "auto", padding: "10px 14px", marginTop: 0 }}>
                        Dodaj
                    </button>
                </div>
                {poruka && (
                    <p className="tekst"> {poruka}</p>
                )}
            </div>
    );
}

function Predlozi() {
    const navigate = useNavigate();

    const [sastanci, setSastanci] = useState([]);
    const [tacke, setTacke] = useState([]);
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

    async function ucitajTacke(id) {
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/" + id + "/tacke");
            const podaci = await odgovor.json();
            setTacke(podaci);
        } catch (greska) {
            console.log("Greska pri ucitavanju tacaka!");
        }
    }
    return (
        <div className="pozadina">
            <Meni/>
            <div className="kartica" style={{ width: "600px" }}>
                <h2 className="naslov">Predlozi po tačkama</h2>

                {/* padajuća lista sastanaka */}
                <select
                    value={sastanakId}
                    onChange={(e) => {
                        setSastanakId(e.target.value);
                        ucitajTacke(e.target.value);
                        ucitajUcesnike(e.target.value);
                    }}
                    className="polje">
                    <option value="">--Izaberi sastanak--</option>
                    {sastanci.map((s) => (
                        <option key={s.id} value={s.id}>{s.tema}</option>
                    ))}
                </select>

                {/*Prikaz tacaka sastanka*/}
                {tacke.map((t) => (
                    <TackaSaPredlozima key={t.id} tacka={t} sastanakId={sastanakId} ucesnici={ucesnici} />
                ))}

                <button onClick={() => navigate("/dashboard")} className="dugme">
                    Nazad
                </button>
            </div>
        </div>
    )

}
export default Predlozi;