import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Meni from "./Meni";

function SastanakSaUcesnicima({ sastanak, mojaCelinaNaziv }) {
    const [mojiUcesnici, setMojiUcesnici] = useState([]);

    useEffect(() => {
        async function ucitaj() {
            try {
                const odgovor = await fetch("http://localhost:8080/api/sastanci/" + sastanak.id + "/ucesnici");
                const svi = await odgovor.json();
                //sada izvlacimo iz celine rukovodioca
                const moji = svi.filter((u) =>
                    u.korisnik && u.korisnik.organizacionaCelina &&
                    u.korisnik.organizacionaCelina.naziv === mojaCelinaNaziv);
                setMojiUcesnici(moji.map((u) => u.korisnik));
            } catch (greska) {
                console.log("Greska pri ucitavanju ucesnika!");
            }
        }
        ucitaj();
    }, []);

    return (
        <div className="tacka-kartica">
            <p className="tekst" style={{ fontWeight: "bold" }}>{sastanak.tema}</p>
            <p style={{ color: "#54463d", fontSize: "14px" }}>
                {new Date(sastanak.datumOdrzavanja).toLocaleDateString("sr-RS")} | {sastanak.status}
            </p>
            <p style={{ color: "#7a8b6f", fontSize: "13px", fontWeight: "bold", marginTop: "6px" }}>
                Učestvovali iz moje celine:
            </p>
            {mojiUcesnici.length === 0 ? (
                <p style={{ color: "#8a8078", fontSize: "13px" }}>Niko.</p>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                    {mojiUcesnici.map((k) => (
                        <li key={k.id} style={{ color: "#54463d", fontSize: "13px" }}>
                            {k.ime} {k.prezime}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function MojiZaposleni() {
    const navigate = useNavigate();
    const [zaposleni, setZaposleni] = useState([]);
    const [sastanci, setSastanci] = useState([]);
    const korisnik = JSON.parse(localStorage.getItem("korisnik"));

    useEffect(() => {
        async function ucitaj() {
            const korisnik = JSON.parse(localStorage.getItem("korisnik"));
            try {
                const z = await fetch("http://localhost:8080/api/korisnici/moji-zaposleni", {
                    headers: { "X-Korisnik": korisnik.korisnickoIme }
                });
                setZaposleni(await z.json());
                const s = await fetch("http://localhost:8080/api/sastanci/moji-zaposleni", {
                    headers: { "X-Korisnik": korisnik.korisnickoIme }
                });
                setSastanci(await s.json());
            } catch (greska) {
                console.log("Greska pri ucitavanju zaposlenih!");
            }
        }
        ucitaj();
    }, []);
    return (
        <div className="pozadina">
            <Meni/>
            <div className="kartica"
                style={{ width: "80%", maxWidth: "1000px" }}>
                <h2 className="naslov">Pregled zaposlenih i sastanaka</h2>

                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                    {/* LEVA KOLONA - zaposleni */}
                    <div style={{ flex: 1 }}>
                        <h3 className="podnaslov">Zaposleni u mojoj celini</h3>
                        {zaposleni.length === 0 ? (
                            <p className="tekst">Nema zaposlenih.</p>
                        ) : (
                            zaposleni.map((z) => (
                                <div key={z.id} className="tacka-kartica">
                                    <p className="tekst" style={{ fontWeight: "bold" }}>
                                        {z.ime} {z.prezime}
                                    </p>
                                    <p style={{ color: "#54463d", fontSize: "14px" }}>
                                        {z.radnoMesto || "—"} | {z.korisnickoIme}
                                    </p>
                                    {z.mejl && (
                                        <p style={{ color: "#8a8078", fontSize: "13px" }}>{z.mejl}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* DESNA KOLONA - sastanci */}
                    <div style={{ flex: 1 }}>
                        <h3 className="podnaslov">Sastanci mojih zaposlenih</h3>
                        {sastanci.length === 0 ? (
                            <p className="tekst">Nema sastanaka</p>
                        ) : (
                            sastanci.map((s) => (
                                <SastanakSaUcesnicima key={s.id} sastanak={s} mojaCelinaNaziv={korisnik.organizacionaCelina} />
                            ))
                        )}
                    </div>
                </div>
                <button onClick={() => navigate("/dashboard")}
                    className="dugme">
                    Nazad
                </button>
            </div>
        </div>
    );

}
export default MojiZaposleni;