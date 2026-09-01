import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
                        <div key={s.id} className="tacka-kartica">
                            <p className="tekst" style={{ fontWeight: "bold" }}>{s.tema}</p>
                            <p style={{ color: "#54463d" }}>Status: {s.status} | Tip: {s.tip}</p>
                        </div>
                    ))
                )}

                <button onClick={() => navigate("/dashboard")} className="dugme">Nazad</button>
            </div>
        </div>
    );
}
export default Kalendar;