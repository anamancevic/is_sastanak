import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../stilovi.css";


function Login() {
  const[korisnickoIme, setKorisnickoIme] = useState("");
  const[lozinka, setLozinka] = useState("");
  const[poruka, setPoruka] = useState("");
   const navigate = useNavigate();

async function prijaviSe() {
   {/* brisanje poruke ukoliko je već nešt bilo napisano pre */}
  setPoruka("");
   try {
      const odgovor = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ korisnickoIme, lozinka }),
      });
      if (!odgovor.ok) {
    setPoruka("Pogresno korisnicko ime ili lozinka!")
    return;
  }
  const korisnik = await odgovor.json();
  {/* pretvaramo u tekst i cuvamo u korisnik  */}
  localStorage.setItem("korisnik", JSON.stringify(korisnik));
  setPoruka("Dobrodosli, " + korisnickoIme + "!Uloge: " + korisnik.uloge.join(", "));
  navigate("/dashboard");
  }
  catch (greska) {
      setPoruka("Greška u povezivanju sa serverom");
    }
}

  return (

    <div className="pozadina">
      <div className="kartica">
        <h2 className="naslov">
          PRIJAVA</h2>
      {/* polje za unos korisničkog imena */}
      <input
        type='text'
        placeholder='Korisnicko ime'
        value={korisnickoIme}
        onChange={(e) => setKorisnickoIme(e.target.value)}
        className="polje"
      />
{/* polje za unos lozinke*/}
      <input
      type='password'
      placeholder='Lozinka'
      value={lozinka}
      onChange={(e)=>setLozinka(e.target.value)}
      className="polje"
      />
      <button onClick={prijaviSe}
      className="dugme">Prijavi se</button>
      {/* Ispisivanje poruke na ekranu*/}
      {poruka && 
      <p className="tekst">
          {poruka}
          </p>}

      </div>
    </div>
  );
}

export default Login