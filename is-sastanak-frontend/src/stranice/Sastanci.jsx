import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SastanakKartica({ sastanak }) {
    const [prikaziFormu, setPrikaziFormu] = useState(false);
    const [status, setStatus] = useState(sastanak.status);
    const [zakljucak, setZakljucak] = useState(sastanak.zakljucak || "");
    const [poruka, setPoruka] = useState("");

    const korisnik = JSON.parse(localStorage.getItem("korisnik"));

    const jeAdmin = korisnik.uloge.includes("administrator");
    const jeRukovodilac = korisnik.uloge.includes("rukovodilac");
    const jeZapisnicar = korisnik.uloge.includes("zapisnicar");

    async function sacuvajIzmenu() {
        setPoruka("");
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/" + sastanak.id + "/status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Korisnik": korisnik.korisnickoIme
                },
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
            {sastanak.rukovodilac && sastanak.rukovodilac.organizacionaCelina && (
                <p style={{ color: "#7a8b6f", fontSize: "13px", fontStyle: "italic" }}>
                    {sastanak.organizacionaCelina.id === sastanak.rukovodilac.organizacionaCelina.id
                        ? "Matična celina" : "Druga celina"}
                </p>
            )}
            <p className="tekst"> Datum: {sastanak.datumOdrzavanja}</p>
            <p className="tekst">Status: {sastanak.status} | Tip: {sastanak.tip}</p>
            <p className="tekst"> Kategorija: {sastanak.kategorija.naziv}</p>
            {sastanak.zakljucak && (
                <p className="tekst"> Zakljucak: {sastanak.zakljucak}</p>
            )}

            {(jeAdmin || jeRukovodilac || jeZapisnicar) &&
                <button onClick={() => setPrikaziFormu(!prikaziFormu)}
                    className="dugme"
                    style={{ width: "auto", padding: "8px 16px", marginTop: "8px" }}>
                    {prikaziFormu ? "Zatvori" : "Izmeni status"}
                </button>
            }


            {prikaziFormu && (
                <div style={{ marginTop: "12px" }}>
                    <select value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="polje">
                        <option value="ZAKAZAN">Zakazan</option>
                        <option value="ODRZAN">Održan</option>
                        <option value="ODLOZEN">Odložen</option>
                        <option value="NEODRZAN">Neodržan</option>
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

    const [klasifikacija, setKlasifikacija] = useState("sve");//da li je sve, maticna ili druga

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

    async function filtrirajKlasifikaciju(vrsta) {
        if (vrsta === "sve") {
            ucitajSastanke(0);//vraca klasicno na paginaciju
            return;
        }
        //ucitava sve sastanke bez paginacije pa filtrira i onda tek paginacija
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci");
            const svi = await odgovor.json();

            const filtrirani = svi.filter((s) => {
                if (!s.rukovodilac || !s.rukovodilac.organizacionaCelina) {
                    return false;
                }
                const istaCelina = s.organizacionaCelina.id === s.rukovodilac.organizacionaCelina.id;
                return vrsta === "maticna" ? istaCelina : !istaCelina;
            });
            setSastanci(filtrirani);
            setUkupnoStrana(0);//sakrivamo paginaciju kod klasifikacije
        } catch (greska) {
            console.log("Greska pri filtriranju klasifikacije!");
        }
    }

    return (
        <div className="pozadina">
            <div className="kartica" style={{ width: "80%", maxWidth: "1000px" }}>
                <h2 className="naslov">
                    Sastanci
                </h2>
                {/*Filtriranje prema org celini */}
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
                {/*Filtriranje prema celini da li je maticna ili ne u odnosu na rukovodioca */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", justifyContent: "center" }}>
                    <button
                        onClick={() => filtrirajKlasifikaciju("sve")}
                        className="dugme"
                        style={{
                            width: "auto", padding: "8px 16px", marginTop: 0,
                            backgroundColor: klasifikacija === "sve" ? "#54463d" : "#a08b7d"
                        }}>
                        Sve
                    </button>
                    <button
                        onClick={() => filtrirajKlasifikaciju("maticna")}
                        className="dugme"
                        style={{
                            width: "auto", padding: "8px 16px", marginTop: 0,
                            backgroundColor: klasifikacija === "maticna" ? "#54463d" : "#a08b7d"
                        }}>
                        Matična celina
                    </button>
                    <button
                        onClick={() => filtrirajKlasifikaciju("druga")}
                        className="dugme"
                        style={{
                            width: "auto", padding: "8px 16px", marginTop: 0,
                            backgroundColor: klasifikacija === "druga" ? "#54463d" : "#a08b7d"
                        }}>
                        Druga celina
                    </button>
                </div>
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