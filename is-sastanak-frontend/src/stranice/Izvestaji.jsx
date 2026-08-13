import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Izvestaji() {
    const navigate = useNavigate();

    const [sastanci, setSastanci] = useState([]);
    const [izabraniSastanak, setIzabraniSastanak] = useState(null);

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
    }

    return (
        <div className="pozadina">
            <div className="kartica"
                style={{ width: "600px" }}>
                <h2 className="naslov">Izvestaj o sastanku</h2>
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
                        <p style={{ color: "#54463d", margin: "6px 0" }}>
                            <b>Rukovodilac:</b> {izabraniSastanak.rukovodilac.ime} {izabraniSastanak.rukovodilac.prezime}
                        </p>
                        {izabraniSastanak.zakljucak && (
                            <p style={{ color: "#54463d", margin: "6px 0" }}>
                                <b>Zaključak:</b> {izabraniSastanak.zakljucak}
                            </p>
                        )}
                    </div>
                )}
                <button onClick={()=>navigate("/dashboard")} className="dugme">Nazad</button>
            </div>
        </div>
    )

}
export default Izvestaji;