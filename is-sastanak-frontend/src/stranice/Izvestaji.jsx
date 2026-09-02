import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TackaIzvestaj({ tacka }) {
    const [predlozi, setPredlozi] = useState([]);

    useEffect(() => {
        async function ucitaj() {
            try {
                const odgovor = await fetch("http://localhost:8080/api/predlozi/tacka/" + tacka.id);
                setPredlozi(await odgovor.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju predloga!");
            }
        }
        ucitaj();
    }, []);

    return (
        <div style={{ marginBottom: "12px" }}>
            <p className="tekst" style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {tacka.redniBroj}.  {tacka.sadrzaj}
            </p>
            {predlozi.length === 0 ? (
                <p className="tekst">Nema predloga</p>
            ) : (
                <ul style={{ paddingLeft: "30px", listStyle: "none" }}>
                    {predlozi.map((p) => (
                        <li key={p.id}
                            style={{ color: "#54463d", fontSize: "14px", marginBottom: "3px" }}>
                            {p.tekst} {p.korisnik ? "(" + p.korisnik.ime
                                + " " + p.korisnik.prezime + ")" : ""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Izvestaji() {
    const navigate = useNavigate();

    const [sastanci, setSastanci] = useState([]);
    const [tacke, setTacke] = useState([]);
    const [izabraniSastanak, setIzabraniSastanak] = useState(null);
    const [prikaziPotpuni, setPrikaziPotpuni] = useState(false);
    const [prisustvo, setPrisustvo] = useState([]);
    const[sumirani, setSumirani] = useState([]);
    const[prikazSumirani, setPrikazSumirani] = useState(false);

    useEffect(() => {
        async function ucitaj() {
            try {
                const s = await fetch("http://localhost:8080/api/sastanci");
                setSastanci(await s.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju sastanaka");
            }
        }
        ucitaj();
    }, []);

    function izaberiSastanak(id) {
        const sastanak = sastanci.find((s) => s.id === parseInt(id));
        setIzabraniSastanak(sastanak);
        setPrikaziPotpuni(false);

    }

    async function ucitajPotpuni() {
        if (!izabraniSastanak) {
            return
        }
        try {
            const t = await fetch("http://localhost:8080/api/sastanci/" + izabraniSastanak.id + "/tacke");
            setTacke(await t.json());

            const p = await fetch("http://localhost:8080/api/sastanci/" + izabraniSastanak.id + "/prisustvo");
            setPrisustvo(await p.json());

            setPrikaziPotpuni(true);
        } catch (greska) {
            console.log("Greska pri ucitavanju potpunog izvestaja!");
        }
    }

    async function ucitajSumirani() {
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/sumirani-broj-ucesca-moj",{
                headers: {"X-Korisnik": korisnik.korisnickoIme}
            });
            setSumirani(await odgovor.json());
            setPrikazSumirani(true);
        } catch (greska) {
            console.log("Greska pri ucitavanju sumiranih!");
        }
    }

    return (
        <div className="pozadina">
            <div className="kartica"
                style={{ width: "80%", maxWidth: "1000px" }}>
                <h2 className="naslov">Izvestaji</h2>
                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                    {/*Deo sa izvestajima o sastancima*/}
                    <div style={{flex: 1}}>
                        <h3 className="podnaslov">Izvestaj o sastanku</h3>
                        <select
                            onChange={(e) => izaberiSastanak(e.target.value)}
                            className="polje">
                            <option value="">--Izaberi sastanak--</option>
                            {sastanci.map((s) => (
                                <option key={s.id} value={s.id}>{s.tema}</option>
                            ))}
                        </select>

                        {izabraniSastanak && (
                            <div className="tacka-kartica">
                                 <div style={{
                                    backgroundColor: "#7a8b6f",
                                    color: "white",
                                    padding: "10px 14px",
                                    borderRadius: "6px",
                                    marginBottom: "12px",
                                    fontWeight: "bold"
                                }}>
                                    RUKOVODILAC: {izabraniSastanak.rukovodilac.ime} {izabraniSastanak.rukovodilac.prezime}
                                </div>
                                <h3 className="podnaslov">
                                    {izabraniSastanak.tema}
                                </h3>
                                <p style={{ color: "#54463d", margin: "6px 0" }}>
                                    <b>Datum:</b> {izabraniSastanak.datumOdrzavanja}
                                </p>
                                <p style={{ color: "#54463d", margin: "6px 0" }}>
                                    <b>Status:</b> {izabraniSastanak.status}
                                </p>
                                <p style={{ color: "#54463d", margin: "6px 0" }}>
                                    <b>Tip:</b> {izabraniSastanak.tip}
                                </p>
                                <p style={{ color: "#54463d", margin: "6px 0" }}>
                                    <b>Kategorija:</b> {izabraniSastanak.kategorija.naziv}
                                </p>
                                <p style={{ color: "#54463d", margin: "6px 0" }}>
                                    <b>Organizaciona celina:</b> {izabraniSastanak.organizacionaCelina.naziv}
                                </p>
                                {izabraniSastanak.zakljucak && (
                                    <p style={{ color: "#54463d", margin: "6px 0" }}>
                                        <b>Zaključak:</b> {izabraniSastanak.zakljucak}
                                    </p>
                                )}
                                <button
                                    onClick={() => {
                                        if (prikaziPotpuni) {
                                            setPrikaziPotpuni(false);
                                        } else {
                                            ucitajPotpuni();
                                        }
                                    }}
                                    className="dugme"
                                    style={{ marginTop: 0 }}>
                                    {prikaziPotpuni ? "Sakrij potpuni izveštaj" : "Prikazi potpuni izveštaj"}
                                </button>
                                {prikaziPotpuni && (

                                    <div style={{ marginTop: "16px" }}>

                                        <h3 className="podnaslov">
                                            Tacke dnevnog reda
                                        </h3>
                                        {tacke.length === 0 ? (
                                            <p className="tekst">Nema tačaka</p>
                                        ) : (
                                            tacke.map((t) => (
                                                <TackaIzvestaj key={t.id} tacka={t} />
                                            ))
                                        )}
                                        <h3 className="podnaslov">Prisustvo</h3>
                                        {prisustvo.length === 0 ? (
                                            <p className="tekst">Nema evidentiranog prisustva</p>
                                        ) : (
                                            <ul style={{ paddingLeft: "20px", listStyle: "none" }}>
                                                {prisustvo.map((p) => (
                                                    <li key={p.id}
                                                        style={{ color: "#54463d", marginBottom: "4px" }}>
                                                        {p.korisnik ? p.korisnik.ime + " "
                                                            + p.korisnik.prezime : "Nepoznat"}
                                                        — {p.status}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                )}
                                 {izabraniSastanak.zapisnicar && (
                                    <div style={{
                                        backgroundColor: "#a08b7d",
                                        color: "white",
                                        padding: "10px 14px",
                                        borderRadius: "6px",
                                        marginTop: "12px",
                                        fontWeight: "bold"
                                    }}>
                                        ZAPISNIČAR: {izabraniSastanak.zapisnicar.ime} {izabraniSastanak.zapisnicar.prezime}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/*Deo sa sumiranim brojem ucesca*/}
                    <div style={{flex: 1}}>
                        <h3 className="podnaslov">Sumirani broj učešća</h3>
                       <button onClick={()=> {
                        if (prikazSumirani) {
                            setPrikazSumirani(false);
                        } else{
                            ucitajSumirani();
                        }
                       }}
                       className="dugme"
                       style={{ marginTop: 0 }}>
                        {prikazSumirani ? "Sakrij sumirani broj" : "Prikaži sumirani broj"}
                       </button>
                       {prikazSumirani && (
                       <div className="tacka-kartica">
                                {sumirani.length === 0 ? (
                                    <p className="tekst">
                                        Nema evidentiranih učešća
                                    </p>
                                ) : (
                                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                        {sumirani.map((s)=> (
                                            <li key={s.korisnikId}
                                            style={{ color: "#54463d", marginBottom: "6px" }}>
                                                {s.ime} {s.prezime}: <b>{s.brojUcesca}</b>
                                                {s.brojUcesca === 1 ? " sastanak" : " sastanaka"}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                       )}
                            
                        
                    </div>
                </div>

                <button onClick={() => navigate("/dashboard")} className="dugme">Nazad</button>
            </div>
        </div>
    )

}
export default Izvestaji;