import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SastanakKartica({ sastanak }) {
    const [prikaziFormu, setPrikaziFormu] = useState(false);
    const [status, setStatus] = useState(sastanak.status);
    const [zakljucak, setZakljucak] = useState(sastanak.zakljucak || "");
    const [poruka, setPoruka] = useState("");

    async function sacuvajIzmenu() {
        setPoruka("");
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/" + sastanak.id + "/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: status,
                    zakljucak: zakljucak
                }),
            });

            if (!odgovor.ok) {
                setPoruka("Greska pri izmeni");
                return;
            }

            setPoruka("Sacuvano!");
            setPrikaziFormu(false);
        } catch (greska) {
            setPoruka("Greska u povezivanju");
        }
    }
    return (
        <div className="tacka-kartica">
            <h3 className="podnaslov">
                {sastanak.tema}
            </h3>
            <p className="tekst"> Datum: {sastanak.datumOdrzavanja}</p>
            <p className="tekst">Status: {sastanak.status} | Tip: {sastanak.tip}</p>
            <p className="tekst"> Kategorija: {sastanak.kategorija.naziv}</p>
            {sastanak.zakljucak && (
                <p className="tekst"> Zakljucak: {sastanak.zakljucak}</p>
            )}
            <button onClick={() => setPrikaziFormu(!prikaziFormu)}
                className="dugme"
                tyle={{ width: "auto", padding: "8px 16px", marginTop: "8px" }}>
                {prikaziFormu ? "Zatvori" : "Izmeni status"}
            </button>

            {prikaziFormu && (
                <div style={{ marginTop: "12px" }}>
                    <select value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="polje">
                        <option value="ZAKAZAN">Zakazan</option>
                        <option value="ODRZAN">Održan</option>
                        <option value="ODLOZEN">Odložen</option>
                        <option value="NEODRŽAN">Neodržan</option>
                    </select>

                    <textarea placeholder="Zaključak sastanka"
                        value={zakljucak}
                        onChange={(e) => setZakljucak(e.target.value)}
                        className="polje"
                        style={{ minHeight: "80px", resize: "vertical" }}
                    />
                    <button onClick={sacuvajIzmenu}
                        className="dugme">Sačuvaj</button>
                    {poruka && <p className="tekst">{poruka}</p>}
                </div>
            )}
        </div>
    );
}

function Sastanci() {
    const navigate = useNavigate();
    const [celine, setCeline] = useState([]);
    const [sastanci, setSastanci] = useState([]);
    const [izabranaCelina, setIzabranaCelina] = useState("");

    const [strana, setStrana] = useState(0);
    const [ukupnoStrana, setUkupnoStrana] = useState(0);

    useEffect(() => {
        async function ucitajCeline() {
            try {
                const c = await fetch("http://localhost:8080/api/celine");
                setCeline(await c.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju celina!");
            }
        }
        ucitajCeline();
        ucitajSastanke(0);  // prva strana sastanaka
    }, []);

    async function ucitajSastanke(brojStrane) {
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/stranica?strana=" + brojStrane + "&velicina=2");
            const podaci = await odgovor.json();
            setSastanci(podaci.content);
            setUkupnoStrana(podaci.totalPages);
            setStrana(brojStrane);
        } catch (greska) {
            console.log("Greska pri ucitavanju sastanaka!");
        }
    }

    async function filtrirajPoCelini(celinaId) {
        setIzabranaCelina(celinaId);
        try {
            let url;
            if (celinaId === "") {
                url = "http://localhost:8080/api/sastanci";
            }
            else {
                url = "http://localhost:8080/api/sastanci/celina/" + celinaId;
            }
            const odgovor = await fetch(url);
            setSastanci(await odgovor.json());
        } catch (greska) {
            console.log("Greska pri filtriranju!");
        }
    }

    return (
        <div className="pozadina">
            <div className="kartica" style={{ width: "80%", maxWidth: "1000px" }}>
                <h2 className="naslov">
                    Sastanci
                </h2>
                <select value={izabranaCelina}
                    onChange={(e) => filtrirajPoCelini(e.target.value)}
                    className="polje"
                    style={{ maxWidth: "300px", marginBottom: "20px" }}>
                    <option value="">--Izaberi celinu--</option>
                    {celine.map((c) => (
                        <option key={c.id}
                            value={c.id}>{c.naziv}</option>
                    ))}
                </select>
                {sastanci.map((s) => (
                    <SastanakKartica key={s.id} sastanak={s} />
                ))}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                    <button
                        onClick={() => ucitajSastanke(strana - 1)}
                        disabled={strana === 0}
                        className="dugme"
                        style={{ width: "auto", padding: "8px 16px", marginTop: 0 }}>
                        Prethodna
                    </button>

                    <span style={{ color: "#54463d" }}>
                        Strana {strana + 1} od {ukupnoStrana}
                    </span>

                    <button
                        onClick={() => ucitajSastanke(strana + 1)}
                        disabled={strana >= ukupnoStrana - 1}
                        className="dugme"
                        style={{ width: "auto", padding: "8px 16px", marginTop: 0 }}>
                        Sledeća
                    </button>
                </div>
                <button onClick={() => navigate("/dashboard")}
                    className="dugme">
                    Nazad
                </button>
            </div>
        </div>
    )
}

export default Sastanci;