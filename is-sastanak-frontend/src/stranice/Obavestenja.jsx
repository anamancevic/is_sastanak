import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Obavestenja() {
    const navigate = useNavigate();
    const [obavestenja, setObavestenja] = useState([]);


    async function ucitajObavestenja() {
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/obavestenja/korisnik/" + korisnik.id);
            setObavestenja(await odgovor.json());
        } catch (greska) {
            console.log("Greska pri ucitavanju obavestenja");
        }
    }

    useEffect(() => {
        ucitajObavestenja();
    }, []);


    async function oznaciProcitano(id) {
        try {
            await fetch("http://localhost:8080/api/obavestenja/" + id + "/procitano", {
                method: "PUT",
            });
            ucitajObavestenja();
        } catch (greska) {
            console.log("Greska pri oznacavanju obavestenja!");
        }
    }

    return (
        <div className="pozadina">
            <div className="kartica" style={{ width: "80%", maxWidth: "600px" }}>
                <h2 className="naslov">Obavestenja</h2>

                {obavestenja.length === 0 ? (
                    <p className="tekst">Nema obavestenja!</p>
                ) : (
                    obavestenja.map((o) => (
                        <div key={o.id}
                            style={{
                                backgroundColor: o.procitano ? "#f5f0eb" : "#faf7f3",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                borderLeft: o.procitano ? "4px solid #d6ccc2" : "4px solid #7a8b6f"
                            }}>
                            <p style={{ color: "#54463d", marginBottom: "6px" }}>{o.sadrzaj}</p>
                            <p style={{ color: "#8a8078", fontSize: "12px", marginBottom: "8px" }}>
                                {o.datumVreme}
                            </p>
                            {!o.procitano && (
                                <button onClick={() => oznaciProcitano(o.id)}
                                    className="dugme"
                                    style={{
                                        width: "auto", padding: "6px 12px",
                                        marginTop: 0, fontSize: "13px"
                                    }}>
                                    Označi kao pročitano
                                </button>
                            )}
                        </div>
                    ))
                )}
                <button onClick={() => navigate("/dashboard")}
                    className="dugme">
                    Nazad
                </button>
            </div>
        </div>
    )
}

export default Obavestenja;