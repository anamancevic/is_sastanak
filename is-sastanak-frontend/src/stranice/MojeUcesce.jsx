import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";
import jsPDF from "jspdf";


function MojeUcesce() {
    const navigate = useNavigate();
    const [sastanci, setSastanci] = useState([]);
    const [period, setPeriod] = useState("godina");

    async function ucitaj(izabraniPeriod) {
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/moje-ucesce?period=" + izabraniPeriod, {
                headers: { "X-Korisnik": korisnik.korisnickoIme }
            });
            const listaSastanaka = await odgovor.json();

            //za svaki sastanak učitaj i tačke
            const saTackama = await Promise.all(
                listaSastanaka.map(async (s) => {
                    const t = await fetch("http://localhost:8080/api/sastanci/" + s.id + "/tacke");
                    const tacke = await t.json();
                    return { ...s, tacke: tacke };  //dodaj tačke sastanku
                })
            );

            setSastanci(saTackama);
            setPeriod(izabraniPeriod);
        } catch (greska) {
            console.log("Greska pri ucitavanju");
        }
    }
    useEffect(() => {
        ucitaj("godina");
    }, []);

    function izveziPdf() {
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(16);
        doc.text("Izvestaj o ucescu na sastancima", 20, y);
        y += 8;
        doc.setFontSize(11);
        doc.text("Period: " + (period === "mesec" ? "Ovaj mesec" : "Ova godina"), 20, y);
        y += 12;

        sastanci.forEach((s) => {
            doc.setFontSize(13);
            doc.text(s.tema, 20, y);
            y += 6;

            doc.setFontSize(10);
            doc.text("Datum: " + new Date(s.datumOdrzavanja).toLocaleDateString("sr-RS"), 20, y);
            y += 6;

            doc.text("Tacke dnevnog reda:", 20, y);
            y += 5;

            if (s.tacke && s.tacke.length > 0) {
                s.tacke.forEach((t) => {
                    doc.text("  " + t.redniBroj + ". " + t.sadrzaj, 25, y);
                    y += 5;
                });
            } else {
                doc.text("  Nema tacaka", 25, y);
                y += 5;
            }

            y += 6;  // razmak između sastanaka

            // nova strana ako se popuni
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
        doc.save("moje-ucesce.pdf");
    }

    return (
        <div
            className="pozadina"
            style={{ alignItems: "flex-start" }}>
            <Meni />
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
                        <div
                            key={s.id}
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
                                    {s.tema}
                                </p>
                                <p
                                    className="tekst"
                                    style={{
                                        fontSize: "15px",
                                        marginBottom: "0"
                                    }}>
                                    Datum:{" "}
                                    {new Date(
                                        s.datumOdrzavanja
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
                                {s.tacke &&
                                    s.tacke.some((t) => t.sadrzaj && t.sadrzaj.trim() !== "") ? (
                                    <ul
                                        style={{
                                            listStyle: "none",
                                            padding: "0",
                                            margin: "0"
                                        }}>
                                        {s.tacke.map((t) => (
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
                                ) : (
                                    <p
                                        className="tekst"
                                        style={{ fontSize: "14px" }}>
                                        Nema tačaka.
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div
                    className="korisnici-dugmad"
                    style={{
                        marginTop: "auto",
                        paddingTop: "30px"
                    }}>
                    <div className="korisnici-dugmad">
                        <button
                            onClick={izveziPdf}
                            className="dugme"
                        >
                            Izvezi u PDF
                        </button>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="dugme2"
                        >
                            Nazad
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MojeUcesce;