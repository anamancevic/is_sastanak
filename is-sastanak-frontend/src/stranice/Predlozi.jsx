import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function TackaSaPredlozima({ tacka, sastanakId, ucesnici }) {
    const [predlozi, setPredlozi] = useState([]);
    const [tekst, setTekst] = useState("");
    const [korisnikId, setKorisnikId] = useState("");
    const [poruka, setPoruka] = useState("");

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
        if (korisnikId === "") return "Izaberite korisnika koji daje predlog!";
        if (tekst.trim() === "") return "Morate uneti tekst predloga!";
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
                headers: {
                    "Content-Type": "application/json",
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
        <div style={{ padding: "25px 0", borderBottom: "1px solid #eeeaf5" }}>
            <h3
                className="podnaslov"
                style={{ fontSize: "19px", marginBottom: "15px" }}>
                {tacka.redniBroj}. {tacka.sadrzaj}
            </h3>
            <p
                className="tekst"
                style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Postojeći predlozi:
            </p>
            {predlozi.length === 0 ? (
                <p className="tekst">
                    Nema predloga.
                </p>
            ) : (
                <ul
                    style={{
                        listStyle: "none",
                        padding: "0",
                        marginBottom: "20px"
                    }}>
                    {predlozi.map((p) => (
                        <li
                            key={p.id}
                            className="tekst"
                            style={{
                                marginBottom: "8px",
                                paddingLeft: "12px",
                                borderLeft: "3px solid #8e7cab"
                            }}>
                            {p.tekst}
                            {p.korisnik && (
                                <span style={{ color: "#8d8598" }}>
                                    {" "}— {p.korisnik.ime}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <p
                className="tekst"
                style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Dodaj novi predlog:
            </p>
            <div className="predlog-red">
                <select
                    value={korisnikId}
                    onChange={(e) => setKorisnikId(e.target.value)}
                    className="polje"
                    style={{ marginBottom: "0", flex: 1 }}>
                    <option value="">
                        -- Ko daje predlog --
                    </option>
                    {ucesnici.map((u) => (
                        <option key={u.id} value={u.korisnik.id}>
                            {u.korisnik.ime} {u.korisnik.prezime}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Novi predlog"
                    value={tekst}
                    onChange={(e) => setTekst(e.target.value)}
                    className="polje"
                    style={{ marginBottom: "0", flex: 1 }} />
                <button
                    onClick={dodajPredlog}
                    className="dugme"
                    style={{
                        width: "auto",
                        padding: "10px 18px",
                        marginTop: "0"
                    }}>
                    Dodaj
                </button>
            </div>
            {poruka && (
                <p
                    className="tekst"
                    style={{ marginTop: "12px", marginBottom: "0" }}>
                    {poruka}
                </p>
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
            <Meni />
            <div className="korisnici-sadrzaj">
                <h2 className="naslov">
                    Predlozi po tačkama dnevnog reda
                </h2>
                <h3
                    className="podnaslov"
                    style={{ fontSize: "20px", marginBottom: "12px" }}>
                    Izaberite sastanak
                </h3>
                <select
                    value={sastanakId}
                    onChange={(e) => {
                        const id = e.target.value;
                        setSastanakId(id);

                        if (id !== "") {
                            ucitajTacke(id);
                            ucitajUcesnike(id);
                        } else {
                            setTacke([]);
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
                <h3
                    className="podnaslov"
                    style={{ fontSize: "20px", marginTop: "30px" }}>
                    Tačke dnevnog reda
                </h3>
                {sastanakId === "" ? (
                    <p className="tekst">
                        Izaberite sastanak da biste videli tačke dnevnog reda.
                    </p>
                ) : tacke.length === 0 ? (
                    <p className="tekst">
                        Ovaj sastanak nema tačke dnevnog reda.
                    </p>
                ) : (
                    tacke.map((t) => (
                        <TackaSaPredlozima
                            key={t.id}
                            tacka={t}
                            sastanakId={sastanakId}
                            ucesnici={ucesnici} />
                    ))
                )}
                <div className="korisnici-dugmad">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="dugme2">
                        Nazad
                    </button>
                </div>
            </div>
        </div>
    );

}
export default Predlozi;