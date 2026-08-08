import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function dodelaUloge() {
    const navigate = useNavigate();

    const [korisnici, setKorisnici] = useState([]);
    const [uloge, setUloge] = useState([]);
    const [celine, setCeline] = useState([]);

    const[korisnikId, setKorisnikId] = useState("");
    const[ulogaId, setUlogaId] = useState("");
    const[organizacionaCelinaId, setOrganizacionaCelinaId] = useState("");
    const[tip, setTip] = useState("STALNA");
    const[napomena, setNapomena] = useState("");
    const[poruka, setPoruka] = useState("");


    {/*Ucitavanje podataka iz baze pri pokretanju stranice*/}
    useEffect(() => {
    async function ucitajPodatke() {
      try {
        const k = await fetch("http://localhost:8080/api/korisnici");
        setKorisnici(await k.json());

        const u = await fetch("http://localhost:8080/api/uloge");
        setUloge(await u.json());

        const c = await fetch("http://localhost:8080/api/celine");
        setCeline(await c.json());
      } catch (greska) {
        console.log("Greška pri učitavanju podataka");
      }
    }
    ucitajPodatke();
  }, []);

async function dodeliUlogu() {
    setPoruka("");
    try {
        const odgovor = await fetch("http://localhost:8080/api/korisnici/dodeli-ulogu", {
             method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          korisnikId: korisnikId,
          ulogaId: ulogaId,
          organizacionaCelinaId: organizacionaCelinaId,
          tip: tip,
          napomena: napomena 
        }),
        });
        if (!odgovor.ok) {
            setPoruka("Greska pri dodeli uloge!");
            return;
        }
        setPoruka("Uloga je uspesno dodeljena!");
        setKorisnikId("");
        setUlogaId("");
      setOrganizacionaCelinaId("");
      setTip("STALNA");
      setNapomena("");
    } catch (greska) {
        setPoruka("Greska u povezivanju sa serverom");
    }
}

  return(
    <div className="pozadina">
            <div className="kartica">
            <h2 className="naslov">
                Dodela uloge
            </h2>
{/* Padajuca lista korisnici */}
        <select value={korisnikId} onChange={(e)=> setKorisnikId(e.target.value)}
            className="polje">
                    <option value="">
                        --Izaberi korisnika--
                    </option>
                    {korisnici.map((k)=>(
                        <option key={k.id} value={k.id}>
                            {k.ime} {k.prezime} ({k.korisnickoIme})
                        </option>
                    ))}
        </select>
{/* Padajuca lista uloge */}
        <select value={ulogaId} onChange={(e) => setUlogaId(e.target.value)} className="polje">
          <option value="">-- Izaberi ulogu --</option>
          {uloge.map((u) => (
            <option key={u.id} value={u.id}>
              {u.naziv}
            </option>
          ))}
        </select>
{/* Padajuca lista celine */}
        <select value={organizacionaCelinaId} 
        onChange={(e) => setOrganizacionaCelinaId(e.target.value)} className="polje">
          <option value="">-- Izaberi organizacionu celinu --</option>
          {celine.map((c) => (
            <option key={c.id} value={c.id}>
              {c.naziv}
            </option>
          ))}
        </select>
{/* Padajuca lista tip */}
            <select value={tip} onChange={(e) => setTip(e.target.value)} className="polje">
          <option value="STALNA">Stalna</option>
          <option value="PRIVREMENA">Privremena</option>
        </select>
{/* polje za unos napomene */}
        <input
          type="text"
          placeholder="Napomena (opciono)"
          value={napomena}
          onChange={(e) => setNapomena(e.target.value)}
          className="polje"
        />
{/* dugme za dodeljivanje uoge */}
          <button onClick={dodeliUlogu} className="dugme">
                Dodeli ulogu
          </button>
{/*Dugme za vracanje nazad*/}
            <button onClick={()=> navigate("/dashboard")}
                className="dugme">
                    Nazad
                </button>
{/* Ispis poruke */}
                {poruka && (<p className="tekst">
                    {poruka}
                </p>)}
            </div>
    </div>
  )
}

export default dodelaUloge;