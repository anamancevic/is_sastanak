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
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "30px",
                padding: "25px 0",
                borderBottom: "1px solid #eeeaf5"
            }}
        >
            <div style={{ flex: 1 }}>
                <p
                    className="podnaslov"
                    style={{
                        fontSize: "20px",
                        marginBottom: "12px",
                        color: "#8d8598"
                    }}
                >
                    {sastanak.tema}
                </p>
                <p
                    className="tekst"
                    style={{
                        marginBottom: "0",
                        fontSize: "15px"
                    }}    >
                    {new Date(
                        sastanak.datumOdrzavanja
                    ).toLocaleDateString("sr-RS")}{" "}
                    | {sastanak.status}
                </p>
            </div>
            <div
                style={{
                    flex: 1,
                    textAlign: "left"
                }} >
                <p
                    className="tekst"
                    style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#8d8598",
                        marginBottom: "10px"
                    }} >
                    Učestvovali iz moje celine:
                </p>
                {mojiUcesnici.length === 0 ? (
                    <p className="tekst">Niko.</p>
                ) : (
                    <ul
                        style={{
                            listStyle: "none",
                            padding: "0",
                            margin: "0"
                        }}>
                        {mojiUcesnici.map((k) => (
                            <li
                                key={k.id}
                                className="tekst"
                                style={{
                                    fontSize: "15px",
                                    marginBottom: "5px"
                                }}>
                                {k.ime} {k.prezime}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
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
            <Meni />
            <div className="korisnici-sadrzaj">
                <h2 className="naslov">
                    Pregled zaposlenih i sastanaka
                </h2>
                <div className="korisnici-forma">
                    <div>
                        <h3 className="podnaslov" style={{ fontSize: "22px" }}>
                            Zaposleni u mojoj celini
                        </h3>
                        {zaposleni.length === 0 ? (
                            <p className="tekst">Nema zaposlenih.</p>
                        ) : (
                            zaposleni.map((z) => (
                                <div key={z.id} style={{
                                    padding: "25px 0",
                                    marginBottom: "15px"
                                }}>
                                    <p
                                        className="tekst"
                                        style={{
                                            fontSize: "20px",
                                            marginBottom: "12px",
                                            fontWeight: "bold",
                                            color: "#8d8598"
                                        }}
                                    >
                                        {z.ime} {z.prezime}
                                    </p>
                                    <p className="tekst" style={{ marginBottom: "5px" }}>
                                        Radno mesto: {z.radnoMesto || "Nije navedeno"}
                                    </p>
                                    <p className="tekst" style={{ marginBottom: "5px" }}>
                                        Korisničko ime: {z.korisnickoIme}
                                    </p>
                                    {z.mejl && (
                                        <p className="tekst" style={{ marginBottom: "0" }}>
                                            E-mail: {z.mejl}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <div>
                        <h3 className="podnaslov" style={{ fontSize: "22px" }}>
                            Sastanci mojih zaposlenih
                        </h3>
                        {sastanci.length === 0 ? (
                            <p className="tekst">Nema sastanaka.</p>
                        ) : (
                            sastanci.map((s) => (
                                <SastanakSaUcesnicima
                                    key={s.id}
                                    sastanak={s}
                                    mojaCelinaNaziv={korisnik.organizacionaCelina}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className="korisnici-dugmad">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="dugme"
                    >
                        Nazad
                    </button>
                </div>
            </div>
        </div>
    );
}
export default MojiZaposleni;