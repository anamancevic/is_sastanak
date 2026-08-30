import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ZakazivanjeSastanka() {
    const navigate = useNavigate();

    const [kategorije, setKategorije] = useState([]);
    const [korisnici, setKorisnici] = useState([]);
    const [celine, setCeline] = useState([]);

    const [tema, setTema] = useState("");
    const [datumOdrzavanja, setDatumOdrzavanja] = useState("");
    const [prostorija, setProstorija] = useState("");
    const [tip, setTip] = useState("VANREDNI");
    const [kategorijaId, setKategorijaId] = useState("");
    const [rukovodilacId, setRukovodilacId] = useState("");
    const [organizacionaCelinaId, setOrganizacionaCelinaId] = useState("");

    const[zapisnicarId, setZapisnicarId] = useState("");
    const[zapisnicari, setZapisnicari] = useState([]);

    const [tacke, setTacke] = useState([{ redniBroj: 1, sadrzaj: "" }]);

    const [poruka, setPoruka] = useState("");

    useEffect(() => {
        async function ucitaj() {
            try {
                const k = await fetch("http://localhost:8080/api/kategorije");
                setKategorije(await k.json());

                const ko = await fetch("http://localhost:8080/api/korisnici");
                setKorisnici(await ko.json());

                const c = await fetch("http://localhost:8080/api/celine");
                setCeline(await c.json());

                const z = await fetch("http://localhost:8080/api/korisnici/zapisnicari");
                setZapisnicari(await z.json());
            } catch (greska) {
                setPoruka("Greska pri ucitavanju podataka!");
            }
        }
        ucitaj();
    }, []);

    function dodajTacku() {
        const poslednja = tacke[tacke.length - 1];
        if (poslednja.sadrzaj.trim() === "") {
            setPoruka("Tačka mora imati sadrzaj!");
            return;
        }
        setPoruka("");
        setTacke([...tacke, { redniBroj: tacke.length + 1, sadrzaj: "" }]);
    }

    function izmeniTacku(index, vrednost) {
        const noveTacke = [...tacke];
        noveTacke[index].sadrzaj = vrednost;
        setTacke(noveTacke);
    }

    function obrisiTacku(index) {
        const noveTacke = tacke.filter((_, i) => i !== index);
        noveTacke.forEach((t, i) => t.redniBroj = i + 1);
        setTacke(noveTacke);
    }

    function proveriUnos() {
        if (tema.trim() === "") return "Tema sastanka je obavezna.";
        if (datumOdrzavanja.trim() === "") return "Datum održavanja je obavezan.";
        if (kategorijaId === "") return "Morate izabrati kategoriju.";
        if (organizacionaCelinaId === "") return "Morate izabrati organizacionu celinu.";
        if (zapisnicarId === "") return "Morate izabrati zapisničara sastanka.";
        if (tacke.length === 0) return "Morate dodati bar jednu tačku dnevnog reda.";
        return "";
    }

    async function zakaziSastanak() {
        setPoruka("");
        const greska = proveriUnos();
        if (greska !== "") {
            setPoruka(greska);
            return;
        }
        const korisnik = JSON.parse(localStorage.getItem("korisnik"));

        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tema: tema,
                    datumOdrzavanja: datumOdrzavanja,
                    prostorija: prostorija,
                    tip: tip,
                    kategorijaId: kategorijaId,
                    rukovodilacId: korisnik.id,
                    organizacionaCelinaId: organizacionaCelinaId,
                    zapisnicarId: zapisnicarId,
                    tacke: tacke
                }),
            });

            if (!odgovor.ok) {
                setPoruka("Greska pri zakazivanju sastanka!");
                return;
            }

            setPoruka("Sastanak je uspesno zakazan!");

            setTema("");
            setDatumOdrzavanja("");
            setProstorija("");
            setTip("VANREDNI");
            setKategorijaId("");
            setOrganizacionaCelinaId("");
            setTacke([{ redniBroj: 1, sadrzaj: "" }]);
        } catch (greska) {
            setPoruka("Greska u povezivanju sa serverom!");
        }
    }

    return (
        <div className="pozadina">
            <div className="kartica" style={{ width: "80%", maxWidth: "1000px" }}>
                <h2 className="naslov">
                    Zakazivanje sastanka
                </h2>
                <div style={{ display: "flex", gap: "24px" }}>
                    <div style={{ flex: 1 }}>

                        {/* polja za unos teme */}
                        <input
                            type="text"
                            placeholder="Tema sastanka"
                            value={tema}
                            onChange={(e) => setTema(e.target.value)}
                            className="polje" />

                        {/* polje za unos datuma */}
                        <input
                            type="datetime-local"
                            value={datumOdrzavanja}
                            onChange={(e) => setDatumOdrzavanja(e.target.value)}
                            className="polje" />

                        {/* polja za unos prostorije */}
                        <input
                            type="text"
                            placeholder="Prostorija"
                            value={prostorija}
                            onChange={(e) => setProstorija(e.target.value)}
                            className="polje" />

                        {/* padajuca lista za unos tipa*/}
                        <select value={tip} onChange={(e) => setTip(e.target.value)}
                            className="polje">
                            <option value="VANREDNI">Vanredni</option>
                            <option value="STALNI">Stalni</option>
                        </select>

                        {/* padajuca lista za unos kategorije*/}
                        <select value={kategorijaId} onChange={(e) => setKategorijaId(e.target.value)}
                            className="polje">
                            <option value="">--Izaberi kategoriju--</option>
                            {kategorije.map((k) => (
                                <option key={k.id} value={k.id}>{k.naziv}</option>
                            ))}
                        </select>

                        {/* padajuca lista za unos celine*/}
                        <select value={organizacionaCelinaId} onChange={(e) => setOrganizacionaCelinaId(e.target.value)}
                            className="polje">
                            <option value="">--Izaberi celinu--</option>
                            {celine.map((c) => (
                                <option key={c.id} value={c.id}>{c.naziv}</option>
                            ))}
                        </select>

                        {/*Padajuca lista za unos zapisnicara sastanka */}
                            <select value={zapisnicarId} 
                            onChange={(e)=> setZapisnicarId(e.target.value)}
                            className="polje">
                                <option value= "">--Izaberi zapisničara sastanka--</option>
                                {zapisnicari.map((z)=> (
                                    <option key={z.id} 
                                    value = {z.id}>
                                        {z.ime} {z.prezime}
                                    </option>
                                ))}
                            </select>
                    </div>

                    <div style={{ flex: 1.3 }}>
                        <div className="kartica2">
                            <h3 className="podnaslov">
                                Tačke dnevnog reda
                            </h3>
                            {tacke.map((t, index) => (
                                <div key={index}
                                    style={{
                                        display: "flex", gap: "8px",
                                        marginBottom: "8px", alignItems: "center"
                                    }}>
                                    {/* polje za unos tačke*/}
                                    <input
                                        type="text"
                                        placeholder={"Tačka: " + (index + 1)}
                                        value={t.sadrzaj}
                                        onChange={(e) => izmeniTacku(index, e.target.value)}
                                        className="polje"
                                        style={{ marginBottom: 0, flex: 1 }} />
                                    {/* dugme za brisanje tačke*/}
                                    <button onClick={() => obrisiTacku(index)}
                                        className="dugme"
                                        style={{
                                            width: "auto", padding: "8px 12px",
                                            marginTop: 0, flexShrink: 0
                                        }}>
                                        Obriši tačku
                                    </button>
                                </div>
                            ))}

                            <button onClick={dodajTacku}
                                className="dugme">
                                Dodaj tačku
                            </button>
                        </div>
                    </div>

                </div>


                <button onClick={zakaziSastanak} className="dugme">
                    Zakaži sastanak
                </button>
                <button onClick={() => navigate("/dashboard")}
                    className="dugme">
                    Nazad
                </button>

                <p className="tekst">
                    {poruka}
                </p>

            </div>
        </div>
    )
}

export default ZakazivanjeSastanka;