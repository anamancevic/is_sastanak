import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function Obavestenja() {
    const navigate = useNavigate();
    const [obavestenja, setObavestenja] = useState([]);
    const [strana, setStrana] = useState(0);
    const [ukupnoStrana, setUkupnoStrana] = useState(0);


    async function ucitajObavestenja(brojStrane) {
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));
        try {
            const odgovor = await fetch("http://localhost:8080/api/obavestenja/korisnik/" + korisnik.id + "/stranica?strana=" + brojStrane + "&velicina=5");
            const podaci = await odgovor.json();
            setObavestenja(podaci.content);
            setUkupnoStrana(podaci.totalPages);
            setStrana(brojStrane);
        } catch (greska) {
            console.log("Greska pri ucitavanju obavestenja");
        }
    }

    useEffect(() => {
        ucitajObavestenja(0);
    }, []);


    async function oznaciProcitano(id) {
        try {
            await fetch("http://localhost:8080/api/obavestenja/" + id + "/procitano", {
                method: "PUT",
            });
            ucitajObavestenja(strana);
        } catch (greska) {
            console.log("Greska pri oznacavanju obavestenja!");
        }
    }

    return (
        <div
            className="pozadina"
            style={{ alignItems: "flex-start" }}>
            <Meni />
            <div
                className="korisnici-sadrzaj"
                style={{ maxWidth: "800px" }}>
                <h2
                    className="naslov"
                    style={{ textAlign: "left" }}>
                    Obaveštenja
                </h2>
                {obavestenja.length === 0 ? (
                    <p className="tekst">
                        Nema obaveštenja.
                    </p>
                ) : (
                    obavestenja.map((o) => (
                        <div
                            key={o.id}
                            style={{
                                padding: "20px 0 20px 18px",
                                marginBottom: "5px",
                                borderBottom: "1px solid #eeeaf5",
                                borderLeft: o.procitano
                                    ? "4px solid #ddd7e8"
                                    : "4px solid #6d55a3"
                            }}>
                            <p
                                className="tekst"
                                style={{
                                    color: o.procitano ? "#81798d" : "#4d455b",
                                    fontWeight: o.procitano ? "normal" : "600",
                                    marginBottom: "8px"
                                }}>
                                {o.sadrzaj}
                            </p>
                            <p
                                className="tekst"
                                style={{
                                    fontSize: "12px",
                                    marginBottom: o.procitano ? "0" : "12px"
                                }}>
                                {new Date(o.datumVreme).toLocaleString("sr-RS")}
                            </p>
                            {!o.procitano && (
                                <button
                                    onClick={() => oznaciProcitano(o.id)}
                                    className="dugme2"
                                    style={{
                                        padding: "7px 12px",
                                        fontSize: "13px"
                                    }}>
                                    Označi kao pročitano
                                </button>
                            )}
                        </div>
                    ))
                )}
                {ukupnoStrana > 1 && (
                    <div className="sastanci-paginacija">
                        <button
                            onClick={() => ucitajObavestenja(strana - 1)}
                            disabled={strana === 0}
                            className="dugme"
                            style={{
                                width: "auto",
                                padding: "8px 16px",
                                marginTop: "0",
                                opacity: strana === 0 ? 0.45 : 1
                            }}>
                            Prethodna
                        </button>
                        <span>
                            Strana {strana + 1} od {ukupnoStrana}
                        </span>
                        <button
                            onClick={() => ucitajObavestenja(strana + 1)}
                            disabled={strana >= ukupnoStrana - 1}
                            className="dugme"
                            style={{
                                width: "auto",
                                padding: "8px 16px",
                                marginTop: "0",
                                opacity: strana >= ukupnoStrana - 1 ? 0.45 : 1
                            }}>
                            Sledeća
                        </button>
                    </div>
                )}
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

export default Obavestenja;