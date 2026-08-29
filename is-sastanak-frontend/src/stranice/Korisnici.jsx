import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stilovi.css";

function Korisnici() {
    const navigate = useNavigate();
    
    const[celina, setCelina] = useState([]);
    const[ime, setIme] =useState("");
    const[imeOca, setImeOca] =useState("");
    const[prezime, setPrezime] =useState("");
    const[jmbg, setJmbg] =useState("");
    const[radnoMesto, setRadnoMesto] =useState("");
    const[kontaktTelefonPosao, setKontaktTelefonPosao] =useState("");
    const[mobilniTelefon, setMobilniTelefon] =useState("");
    const[mejl, setMejl] =useState("");
    const[korisnickoIme, setKorisnickoIme] =useState("");
    const[lozinka, setLozinka] =useState("");
    const[organizacionaCelinaId, setOrganizacionaCelinaId] =useState("");
    const[poruka, setPoruka] =useState("");

   
    useEffect(()=>{
        async function ucitajCeline() {
            try {
                const odgovor = await fetch("http://localhost:8080/api/celine");
                const podaci = await odgovor.json();
                setCelina(podaci);
            } catch (greska) {
                console.log("Greska pri ucitavanju celina!");
            }
        }
        ucitajCeline();
    }, []);

    function proveriUnos() {
        if (ime.trim() === "") return "Ime je obavezno.";
        if (prezime.trim() === "") return "Prezime je obavezno.";
        if (jmbg.trim().length !== 13) return "JMBG mora imati tacno 13 cifara.";
        if (!/^\d+$/.test(jmbg)) return "JMBG sme da sadrzi samo cifre.";
        if(mejl.trim() !== "" && !mejl.includes("@")) return "Mejl nije ispravan, mora sadrzati @";
        if(korisnickoIme.trim() === "") return "Korisnicko ime je obavezno.";
        if(lozinka.length < 4) return "Lozinka mora imati bar 4 karaktera.";
        if(organizacionaCelinaId === "") return "Morate izabrati organizacionu celinu.";
        return "";
    }


    async function dodajKorisnika() {
        setPoruka("");
        const greska = proveriUnos();
        if (greska !== "") {
            setPoruka(greska);
            return;
        }
        try {
            const odgovor = await fetch("http://localhost:8080/api/korisnici", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
          ime: ime,
          imeOca: imeOca,
          prezime: prezime,
          jmbg: jmbg,
          radnoMesto: radnoMesto,
          kontaktTelefonPosao: kontaktTelefonPosao,
          mobilniTelefon: mobilniTelefon,
          mejl: mejl,
          korisnickoIme: korisnickoIme,
          lozinka: lozinka,
          organizacionaCelinaId: organizacionaCelinaId
        }),
            });
            if (!odgovor.ok) {
                setPoruka("Greska pri dodavanju korisnika!");
                return;
            }
            const noviKorisnik = await odgovor.json();
            setPoruka("Korisnik: "  + noviKorisnik.ime + " je uspesno dodat!");

            setIme("");
            setImeOca("");
            setPrezime("");
            setJmbg("");
            setRadnoMesto("");
            setKontaktTelefonPosao("");
            setMobilniTelefon("");
            setMejl("");
            setKorisnickoIme("");
            setLozinka("");
            setOrganizacionaCelinaId("");
        } catch (greska) {
            
            setPoruka("Greska u povezivanju sa serverom!");
        }
    }
    return(
<div className="pozadina">
    <div className="kartica" style={{ width: "80%", maxWidth: "1000px" }}>
        <h2 className="naslov">
           Upravljanje korisnicima 
        </h2>
       
<div style={{display: "flex", gap: "24px"}}>

<div style={{flex: 1}}>
 <input 
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e)=> setIme(e.target.value)}
           className="polje"
           />

        <input 
          type="text"
          placeholder="Ime oca"
          value={imeOca}
          onChange={(e)=> setImeOca(e.target.value)}
           className="polje"
           />

           <input
           type="text"
           placeholder="Prezime"
           value={prezime}
           onChange={(e)=> setPrezime(e.target.value)}
           className="polje"
           />

              <input
          type="text"
          placeholder="JMBG"
          value={jmbg}
          onChange={(e) => setJmbg(e.target.value)}
          className="polje"
        />

        <input 
          type="text"
          placeholder="Radno Mesto"
          value={radnoMesto}
          onChange={(e)=> setRadnoMesto(e.target.value)}
           className="polje"
           />

</div>

 <div style={{flex: 1}}>

 <input 
          type="text"
          placeholder="Kontakt telefon posao"
          value={kontaktTelefonPosao}
          onChange={(e)=> setKontaktTelefonPosao(e.target.value)}
           className="polje"
           />

        <input 
          type="text"
          placeholder="Mobilni telefon"
          value={mobilniTelefon}
          onChange={(e)=> setMobilniTelefon(e.target.value)}
           className="polje"
           />

        <input 
          type="text"
          placeholder="Mejl"
          value={mejl}
          onChange={(e)=> setMejl(e.target.value)}
           className="polje"
           />

        <input
          type="text"
          placeholder="Korisničko ime"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="polje"
        />

        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="polje"
        />

 </div>

</div>

        <select
        value={organizacionaCelinaId}
        onChange={(e) => setOrganizacionaCelinaId(e.target.value)}
        className="polje">
            <option value= "">
                --Izaberi organizaionu celinu--
            </option>
            {celina.map((celina)=>(
                <option key = {celina.id} value={celina.id}>
                    {celina.naziv}
                </option>
            ))}
        </select>

            <button onClick={dodajKorisnika}
            className="dugme">
                Dodaj korisnika
            </button>

        <button onClick={()=> navigate("/dashboard")} 
            className="dugme">
            Nazad
        </button>
        {poruka && (
            <p className="tekst">
                {poruka}
            </p>
        )}
    </div>
</div>
    );
}
export default Korisnici;