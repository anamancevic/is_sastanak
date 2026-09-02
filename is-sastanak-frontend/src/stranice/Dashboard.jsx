import { useNavigate } from "react-router-dom";
import "../stilovi.css";
import Meni from "./Meni";
import meetingSlika from "../assets/meeting.png";

function Dashboard() {
  const navigate = useNavigate();

  {/* pretvara tekst nazad u objekat i cuvamo ga u korisniku */ }
  const korisnik = JSON.parse(localStorage.getItem("korisnik"));

  const jeAdmin = korisnik.uloge.includes("administrator");
  const jeRukovodilac = korisnik.uloge.includes("rukovodilac");
  const jeZapisnicar = korisnik.uloge.includes("zapisnicar");
  const jeUcesnik = korisnik.uloge.includes("ucesnik");

  return (
        <div className="pocetna">
            <Meni />
            <div className="pocetna-sadrzaj">
                {/* LEVA STRANA */}
                <div className="pocetna-tekst">
                    <p className="mali-tekst">
                        SISTEM ZA UPRAVLJANJE SASTANCIMA
                    </p>
                    <h1>
                        Dobrodošli, <span>{korisnik.ime}</span>
                    </h1>
                    <p className="opis-pocetne">
                        Organizujte sastanke, pratite obaveštenja
                        i jednostavno upravljajte svojim obavezama.
                    </p>
                    <p className="uloga-pocetna">
                        Vaša uloga: <b>{korisnik.uloge.join(", ")}</b>
                    </p>
                </div>

                {/* DESNA STRANA */}
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

export default Dashboard;