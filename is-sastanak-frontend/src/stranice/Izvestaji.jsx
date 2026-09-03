import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

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
    const [sumirani, setSumirani] = useState([]);
    const [prikazSumirani, setPrikazSumirani] = useState(false);

    const [period, setPeriod] = useState("godina");

    useEffect(() => {
        async function ucitaj() {
            const korisnik = JSON.parse(localStorage.getItem("korisnik"));
            try {
                const s = await fetch("http://localhost:8080/api/sastanci/moji", {
                    headers: { "X-Korisnik": korisnik.korisnickoIme }
                });
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

    async function ucitajSumirani(izabraniPeriod) {
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/sumirani-broj-ucesca-moj?period=" + izabraniPeriod, {
                headers: { "X-Korisnik": korisnik.korisnickoIme }
            });
            setSumirani(await odgovor.json());
            setPeriod(izabraniPeriod);
            setPrikazSumirani(true);
        } catch (greska) {
            console.log("Greska pri ucitavanju sumiranih!");
        }
    }

    return (
        <div className="pozadina">
            <Meni />
            <div className="korisnici-sadrzaj">
                <h2 className="naslov">
                    Izveštaji
                </h2>
                <div className="korisnici-forma">
                    <div>
                        <h3
                            className="podnaslov"
                            style={{ fontSize: "20px", marginBottom: "20px" }}>
                            Izveštaj o sastanku
                        </h3>
                        <select
                            value={izabraniSastanak ? izabraniSastanak.id : ""}
                            onChange={(e) => izaberiSastanak(e.target.value)}
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
                        {izabraniSastanak && (
                            <div style={{ padding: "20px 0" }}>
                                <h3
                                    className="podnaslov"
                                    style={{ fontSize: "19px", marginBottom: "15px" }}>
                                    {izabraniSastanak.tema}
                                </h3>
                                <p
                                    className="tekst"
                                    style={{ marginBottom: "7px" }}>
                                    <b>Rukovodilac:</b>{" "}
                                    {izabraniSastanak.rukovodilac.ime}{" "}
                                    {izabraniSastanak.rukovodilac.prezime}
                                </p>
                                <p
                                    className="tekst"
                                    style={{ marginBottom: "7px" }}>
                                    <b>Datum:</b>{" "}
                                    {new Date(
                                        izabraniSastanak.datumOdrzavanja
                                    ).toLocaleString("sr-RS")}
                                </p>
                                <p
                                    className="tekst"
                                    style={{ marginBottom: "7px" }}>
                                    <b>Status:</b> {izabraniSastanak.status}
                                </p>
                                <p
                                    className="tekst"
                                    style={{ marginBottom: "7px" }}>
                                    <b>Tip:</b> {izabraniSastanak.tip}
                                </p>
                                <p
                                    className="tekst"
                                    style={{ marginBottom: "7px" }}>
                                    <b>Kategorija:</b>{" "}
                                    {izabraniSastanak.kategorija.naziv}
                                </p>
                                <p
                                    className="tekst"
                                    style={{ marginBottom: "7px" }}>
                                    <b>Organizaciona celina:</b>{" "}
                                    {izabraniSastanak.organizacionaCelina.naziv}
                                </p>
                                {izabraniSastanak.zakljucak && (
                                    <p
                                        className="tekst"
                                        style={{ marginBottom: "7px" }}>
                                        <b>Zaključak:</b>{" "}
                                        {izabraniSastanak.zakljucak}
                                    </p>
                                )}
                                {izabraniSastanak.zapisnicar && (
                                    <p
                                        className="tekst"
                                        style={{ marginBottom: "15px" }}>
                                        <b>Zapisničar:</b>{" "}
                                        {izabraniSastanak.zapisnicar.ime}{" "}
                                        {izabraniSastanak.zapisnicar.prezime}
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
                                    style={{ width: "auto", marginTop: "10px" }}>
                                    {prikaziPotpuni
                                        ? "Sakrij potpuni izveštaj"
                                        : "Prikaži potpuni izveštaj"}
                                </button>
                                {prikaziPotpuni && (
                                    <div style={{ marginTop: "30px" }}>
                                        <h3
                                            className="podnaslov"
                                            style={{ fontSize: "18px", marginBottom: "15px" }}>
                                            Tačke dnevnog reda
                                        </h3>
                                        {tacke.length === 0 ? (
                                            <p className="tekst">
                                                Nema tačaka dnevnog reda.
                                            </p>
                                        ) : (
                                            tacke.map((t) => (
                                                <TackaIzvestaj
                                                    key={t.id}
                                                    tacka={t} />
                                            ))
                                        )}
                                        <h3
                                            className="podnaslov"
                                            style={{
                                                fontSize: "18px",
                                                marginTop: "25px",
                                                marginBottom: "15px"
                                            }}>
                                            Prisustvo
                                        </h3>
                                        {prisustvo.length === 0 ? (
                                            <p className="tekst">
                                                Nema evidentiranog prisustva.
                                            </p>
                                        ) : (
                                            <ul
                                                style={{
                                                    listStyle: "none",
                                                    padding: "0",
                                                    margin: "0"
                                                }}>
                                                {prisustvo.map((p) => (
                                                    <li
                                                        key={p.id}
                                                        className="tekst"
                                                        style={{
                                                            marginBottom: "8px",
                                                            paddingBottom: "8px",
                                                            borderBottom: "1px solid #eeeaf5"
                                                        }}>
                                                        {p.korisnik
                                                            ? p.korisnik.ime +
                                                            " " +
                                                            p.korisnik.prezime
                                                            : "Nepoznat korisnik"}
                                                        {" — "}
                                                        <b>{p.status}</b>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3
                            className="podnaslov"
                            style={{ fontSize: "20px", marginBottom: "20px" }}>
                            Sumirani broj učešća
                        </h3>
                        <p className="tekst">
                            Prikaz ukupnog broja učešća korisnika prema izabranom periodu.
                        </p>
                        <button
                            onClick={() => {
                                if (prikazSumirani) {
                                    setPrikazSumirani(false);
                                } else {
                                    ucitajSumirani("godina");
                                }
                            }}
                            className="dugme"
                            style={{ width: "auto", marginTop: "0" }}>
                            {prikazSumirani
                                ? "Sakrij sumirani broj"
                                : "Prikaži sumirani broj"}
                        </button>
                        {prikazSumirani && (
                            <div style={{ marginTop: "25px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginBottom: "25px"
                                    }}>
                                    <button
                                        onClick={() => ucitajSumirani("nedelja")}
                                        className="dugme2"
                                        style={{
                                            opacity: period === "nedelja" ? 1 : 0.65
                                        }}>
                                        Nedelja
                                    </button>
                                    <button
                                        onClick={() => ucitajSumirani("mesec")}
                                        className="dugme2"
                                        style={{
                                            opacity: period === "mesec" ? 1 : 0.65
                                        }}>
                                        Mesec
                                    </button>
                                    <button
                                        onClick={() => ucitajSumirani("godina")}
                                        className="dugme2"
                                        style={{
                                            opacity: period === "godina" ? 1 : 0.65
                                        }}>
                                        Godina
                                    </button>
                                </div>
                                {sumirani.length === 0 ? (
                                    <p className="tekst">
                                        Nema evidentiranih učešća.
                                    </p>
                                ) : (
                                    <ul
                                        style={{
                                            listStyle: "none",
                                            padding: "0",
                                            margin: "0"
                                        }}>
                                        {sumirani.map((s) => (
                                            <li
                                                key={s.korisnikId}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    gap: "20px",
                                                    padding: "14px 0",
                                                    borderBottom: "1px solid #eeeaf5",
                                                    color: "#5f576c"
                                                }}>
                                                <span>
                                                    {s.ime} {s.prezime}
                                                </span>
                                                <b style={{ color: "#5b3f88" }}>
                                                    {s.brojUcesca}
                                                    {s.brojUcesca === 1
                                                        ? " sastanak"
                                                        : " sastanaka"}
                                                </b>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
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
            </div>
        </div>
    );

}
export default Izvestaji;