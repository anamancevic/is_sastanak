import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function SastanakUcesce({ sastanak }) {
    const [tacke, setTacke] = useState([]);

    useEffect(() => {
        async function ucitaj() {
            try {
                const odgovor = await fetch("http://localhost:8080/api/sastanci/" + sastanak.id + "/tacke");
                setTacke = await odgovor.json();
            } catch (greska) {
                console.log("Greska pri ucitavanju tacaka!");
            }
        }
        ucitaj();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "30px",
                padding: "25px 0",
                borderBottom: "1px solid #eeeaf5"
            }}>
            <div style={{ flex: 1 }}>
                <p
                    className="podnaslov"
                    style={{
                        fontSize: "20px",
                        marginBottom: "12px"
                    }}>
                    {sastanak.tema}
                </p>
                <p
                    className="tekst"
                    style={{
                        fontSize: "15px",
                        marginBottom: "0"
                    }}>
                    Datum:{" "}
                    {new Date(
                        sastanak.datumOdrzavanja
                    ).toLocaleDateString("sr-RS")}
                </p>
            </div>
            <div style={{ flex: 1 }}>
                <p
                    className="tekst"
                    style={{
                        color: "#8d8598",
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "10px"
                    }}>
                    Tačke dnevnog reda:
                </p>
                {tacke.length === 0 ? (
                    <p
                        className="tekst"
                        style={{ fontSize: "14px" }}>
                        Nema tačaka.
                    </p>
                ) : (
                    <ul
                        style={{
                            listStyle: "none",
                            padding: "0",
                            margin: "0"
                        }}>
                        {tacke.map((t) => (
                            <li
                                key={t.id}
                                className="tekst"
                                style={{
                                    fontSize: "14px",
                                    marginBottom: "7px"
                                }}>
                                {t.redniBroj}. {t.sadrzaj}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function MojeUcesce() {
    const navigate = useNavigate();
    const [sastanci, setSastanci] = useState([]);
    const[period, setPeriod] = useState("godina");

    async function ucitaj(izabraniPeriod) {
    const korisnik = JSON.parse(localStorage.getItem("korisnik"));
    try {
         const odgovor = await fetch("http://localhost:8080/api/sastanci/moje-ucesce?period=" + izabraniPeriod, {
        headers: { "X-Korisnik": korisnik.korisnickoIme }
      });
      setSastanci(await odgovor.json());
      setPeriod(izabraniPeriod);
    } catch (greska) {
        console.log("Greska pri ucitavanju!");
    }}
    useEffect(()=>{
        ucitaj("godina");
    }, []);

    return (
    <div
        className="pozadina"
        style={{ alignItems: "flex-start" }}>
        <Meni/>
        <div
            className="korisnici-sadrzaj"
            style={{
                minHeight: "calc(100vh - 65px)",
                display: "flex",
                flexDirection: "column"
            }}>
            <h2
                className="naslov"
                style={{ textAlign: "left" }}>
                Moje učešće na sastancima
            </h2>
            <h3
                className="podnaslov"
                style={{ fontSize: "20px", marginBottom: "15px" }}>
                Izaberite period
            </h3>
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "30px"
                }}>
                <button
                    onClick={() => ucitaj("mesec")}
                    className="dugme2"
                    style={{
                        opacity: period === "godina" ? 1 : 0.6
                    }}>
                    Ovaj mesec
                </button>
                <button
                    onClick={() => ucitaj("godina")}
                    className="dugme2"
                    style={{
                        opacity: period === "mesec" ? 1 : 0.6
                    }}>
                    Ova godina
                </button>
            </div>
            <h3
                className="podnaslov"
                style={{ fontSize: "20px", marginBottom: "15px" }}>
                Sastanci
            </h3>
            {sastanci.length === 0 ? (
                <p className="tekst">
                    Nema sastanaka za izabrani period.
                </p>
            ) : (
                sastanci.map((s) => (
                    <SastanakUcesce
                        key={s.id}
                        sastanak={s} />
                ))
            )}
            <div
                className="korisnici-dugmad"
                style={{
                    marginTop: "auto",
                    paddingTop: "30px"
                }}>
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
export default MojeUcesce;