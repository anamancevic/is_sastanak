import { useNavigate } from "react-router-dom";
import "../stilovi.css";

function Dashboard() {
  const navigate = useNavigate();
  {/* pretvara tekst nazad u objekat i cuvamo ga u korisniku */ }
  const korisnik = JSON.parse(localStorage.getItem("korisnik"));
  return (
    <div className="pozadina">
      <div className="kartica">
        <h2 className="naslov">
          DOBRODOŠLI, {korisnik.ime}
        </h2>

        <p className="tekst">
          Uloga: {korisnik.uloge.join(", ")}
        </p>
        {/* Dugme za prebacivanje administratora za kreiranje korisnika */}
        {korisnik.uloge.includes("administrator") &&
          (<button onClick={() => navigate("/korisnici")}
            className="dugme">
            Upravljanje korisnicima
          </button>)
        }
        {/* Dugme za prebacivanje administratora za dodelu uloge */}
        {korisnik.uloge.includes("administrator") &&
          <button onClick={() => navigate("/dodela-uloge")}
            className="dugme">
            Dodela uloge
          </button>
        }
        {/* Dugme za sastanke */}
        <button onClick={() => navigate("/sastanci")}
          className="dugme">
          Sastanci
        </button>
        {/* Dugme za zakazivanje sastanaka */}
        <button onClick={() => navigate("/zakazivanje-sastanka")}
          className="dugme">
          Zakaži sastanak
        </button>
        {/* Dugme za ucesnike sastanka */}
        <button onClick={() => navigate("/ucesnici")}
          className="dugme">
          Učesnici sastanka
        </button>
        {/*Dugme za evidentiranje prisustva*/}
        <button onClick={()=>navigate("/prisustvo")} 
        className="dugme">
          Evidentiranje prisustva
        </button>
        {/* Dugme za odjavu */}
        <button onClick={() => { localStorage.removeItem("korisnik"); navigate("/"); }}
          className="dugme">
          Odjavi se
        </button>
      </div>
    </div>
  );
}

export default Dashboard;