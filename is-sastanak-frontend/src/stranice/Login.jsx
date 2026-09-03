import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../stilovi.css";
import meetingSlika from "../assets/meeting.png";


function Login() {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [poruka, setPoruka] = useState("");
  const navigate = useNavigate();


  function proveriUnos() {
    if (korisnickoIme.trim() === "") return "Korisnicko ime mora biti uneto!";
    if (lozinka.trim() === "") return "Lozinka mora biti uneta";
    return "";
  }

  async function prijaviSe() {
    {/* brisanje poruke ukoliko je već nešt bilo napisano pre */ }
    setPoruka("");
    const greska = proveriUnos();
    if (greska !== "") {
      setPoruka(greska);
      return;
    }

    try {
      const odgovor = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ korisnickoIme, lozinka }),
      });
      if (!odgovor.ok) {
        setPoruka("Pogresno korisnicko ime ili lozinka!")
        return;
      }
      const korisnik = await odgovor.json();
      {/* pretvaramo u tekst i cuvamo u korisnik  */ }
      localStorage.setItem("korisnik", JSON.stringify(korisnik));
      setPoruka("Dobrodosli, " + korisnickoIme + "!Uloge: " + korisnik.uloge.join(", "));
      navigate("/dashboard");
    }
    catch (greska) {
      setPoruka("Greška u povezivanju sa serverom");
    }
  }

  return (
    <div className="pocetna">
      <div className="gornji-meni">
        <span className="naziv-aplikacije">
          IS-SASTANAK
        </span>
      </div>

      <div className="pocetna-sadrzaj">
        <div className="pocetna-tekst">
          <p className="mali-tekst">
            SISTEM ZA UPRAVLJANJE SASTANCIMA
          </p>

          <h1>
            Dobrodošli u <span>IS-Sastanak</span>
          </h1>

          <p className="opis-pocetne">
            Organizujte sastanke, pratite obaveštenja
            i jednostavno upravljajte svojim obavezama.
          </p>

          <h2 className="naslov">Prijava</h2>

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

          <button onClick={prijaviSe} className="dugme">
            Prijavi se
          </button>

          {poruka && (
            <p className="tekst">
              {poruka}
            </p>
          )}
        </div>

        <div className="pocetna-slika">
          <img
            src={meetingSlika}
            alt="Poslovni sastanak"
          />
        </div>
      </div>
    </div>
  );
}

export default Login
