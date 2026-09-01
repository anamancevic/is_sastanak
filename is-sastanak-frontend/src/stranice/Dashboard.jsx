import { useNavigate } from "react-router-dom";
import "../stilovi.css";

function Dashboard() {
  const navigate = useNavigate();

  {/* pretvara tekst nazad u objekat i cuvamo ga u korisniku */ }
  const korisnik = JSON.parse(localStorage.getItem("korisnik"));

  const jeAdmin = korisnik.uloge.includes("administrator");
  const jeRukovodilac = korisnik.uloge.includes("rukovodilac");
  const jeZapisnicar = korisnik.uloge.includes("zapisnicar");
  const jeUcesnik = korisnik.uloge.includes("ucesnik");

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
        {jeAdmin &&
          (<button onClick={() => navigate("/korisnici")}
            className="dugme">
            Upravljanje korisnicima
          </button>)
        }
        {/* Dugme za prebacivanje administratora za dodelu uloge */}
        {jeAdmin &&
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
        {(jeAdmin || jeRukovodilac) &&
          <button onClick={() => navigate("/zakazivanje-sastanka")}
            className="dugme">
            Zakaži sastanak
          </button>}

        {/* Dugme za ucesnike sastanka */}
        {(jeAdmin || jeRukovodilac) &&
          <button onClick={() => navigate("/ucesnici")}
            className="dugme">
            Učesnici sastanka
          </button>
        }

        {/*Dugme za evidentiranje prisustva*/}
        {(jeAdmin || jeRukovodilac || jeZapisnicar) &&
          <button onClick={() => navigate("/prisustvo")}
            className="dugme">
            Evidentiranje prisustva
          </button>
        }

        {/*Dugme za predloge*/}
        {(jeAdmin || jeZapisnicar) &&
          <button onClick={() => navigate("/predlozi")}
            className="dugme">
            Predlozi
          </button>
        }

        {/*Dugme za prikaz izvestaja*/}
        <button onClick={() => navigate("/izvestaji")}
          className="dugme">
          Izveštaji
        </button>
        {/*Dugme za prikaz obavestenja*/}
        <button onClick={() => navigate("/obavestenja")}
          className="dugme">
          Obavestenja
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