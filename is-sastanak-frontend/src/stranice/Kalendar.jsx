import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Meni from "./Meni";

function SastanakUKalendaru({ sastanak }) {
    const [osobe, setOsobe] = useState([]);

    useEffect(() => {
        async function ucitaj() {
            try {
                if (sastanak.status === "ODRZAN") {
                    const odgovor = await fetch("http://localhost:8080/api/sastanci/" + sastanak.id + "/prisustvo");
                    const prisustvo = await odgovor.json();

                    const prisutni = prisustvo.filter((p) => p.status === "PRISUTAN");
                    setOsobe(prisutni.map((p) => p.korisnik));
                } else {
                    const odgovor = await fetch("http://localhost:8080/api/sastanci/" + sastanak.id + "/ucesnici");
                    const ucesnici = await odgovor.json();
                    setOsobe(ucesnici.map((u) => u.korisnik));
                }
            } catch (greska) {
                console.log("Greska pri ucitavanju osoba!");
            }
        }
        ucitaj();
    }, []);

    return (
        <div className="tacka-kartica">
            <p className="tekst"
                style={{ fontWeight: "bold" }}>{sastanak.tema}</p>
            <p style={{ color: "#54463d" }}>
                Status: {sastanak.status} | Tip: {sastanak.tip}
            </p>
            <p style={{ color: "#54463d", fontWeight: "bold", marginTop: "8px" }}>
                {sastanak.status === "ODRZAN" ? "Prisutni:" : "Planirani učesnici:"}
            </p>
            {osobe.length === 0 ? (
                <p style={{ color: "#8a8078", fontSize: "14px" }}>
                    {sastanak.status === "ODRZAN" ? "Nema evidentiranih prisutnih!" : "Nema planiranih učesnika!"}
                </p>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                    {osobe.map((o, index) => (
                        o ? (
                            <li key={index} style={{ color: "#54463d", fontSize: "14px" }}>
                                {o.ime} {o.prezime}
                            </li>
                        ) : null
                    ))}
                </ul>
            )}
        </div>
    )
}

function Kalendar() {
    const navigate = useNavigate();
    const [sastanci, setSastanci] = useState([]);
    const [izabraniDatum, setIzabraniDatum] = useState(new Date());

    useEffect(() => {
        async function ucitaj() {
            try {
                const odgovor = await fetch("http://localhost:8080/api/sastanci");
                setSastanci(await odgovor.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju sastanaka!");
            }
        }
        ucitaj();
    }, []);

    const sastanciZaDatum = sastanci.filter((s) => {
        const datumSastanka = new Date(s.datumOdrzavanja);
        return datumSastanka.toDateString() === izabraniDatum.toDateString();
    });

    return (
        <div className="pozadina">
            <Meni/>
            <div className="kartica" style={{ width: "80%", maxWidth: "900px" }}>
                <h2 className="naslov">Kalendar sastanaka</h2>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <Calendar
                        onChange={setIzabraniDatum}
                        value={izabraniDatum}
                    />
                </div>

                <h3 className="podnaslov">
                    Sastanci za {izabraniDatum.toLocaleDateString("sr-RS")}
                </h3>

                {sastanciZaDatum.length === 0 ? (
                    <p className="tekst">Nema sastanaka za ovaj datum.</p>
                ) : (
                    sastanciZaDatum.map((s) => (
                       <SastanakUKalendaru key = {s.id} sastanak = {s}/>
                    ))
                )}

                <button onClick={() => navigate("/dashboard")} className="dugme">Nazad</button>
            </div>
        </div>
    );
}
export default Kalendar;