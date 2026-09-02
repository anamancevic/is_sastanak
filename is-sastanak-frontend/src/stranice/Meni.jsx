import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stilovi.css";

function Meni() {

    const navigate = useNavigate();
    const [otvorenMeni, setOtvorenMeni] = useState(false);

    const korisnik = JSON.parse(localStorage.getItem("korisnik"));

    const jeAdmin = korisnik.uloge.includes("administrator");
    const jeRukovodilac = korisnik.uloge.includes("rukovodilac");
    const jeZapisnicar = korisnik.uloge.includes("zapisnicar");


    // Funkcija koja prebaci na drugu stranicu
    // i odmah zatvori bočni meni
    const idiNa = (putanja) => {
        navigate(putanja);
        setOtvorenMeni(false);
    };


    return (
        <>

            {/* GORNJA TRAKA */}
            <div className="gornji-meni">

                {/* Burger ikonica */}
                <button
                    className="burger"
                    onClick={() => setOtvorenMeni(true)}
                >
                    ☰
                </button>

                <span className="naziv-aplikacije">
                    IS- SASTANAK
                </span>

            </div>


            {/* BOČNI MENI */}
            <div className={`bocni-meni ${otvorenMeni ? "otvoren" : ""}`}>

                {/* X za zatvaranje menija */}
                <button
                    className="zatvori-meni"
                    onClick={() => setOtvorenMeni(false)}
                >
                    ×
                </button>


                {/* Upravljanje korisnicima */}
                {jeAdmin &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/korisnici")}
                    >
                        Upravljanje korisnicima
                    </div>
                }


                {/* Dodela uloge */}
                {jeAdmin &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/dodela-uloge")}
                    >
                        Dodela uloge
                    </div>
                }


                {/* Sastanci */}
                <div
                    className="meni-stavka"
                    onClick={() => idiNa("/sastanci")}
                >
                    Sastanci
                </div>


                {/* Kalendar */}
                {(jeAdmin || jeRukovodilac) &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/kalendar")}
                    >
                        Kalendar
                    </div>
                }


                {/* Moji zaposleni */}
                {(jeAdmin || jeRukovodilac) &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/moji-zaposleni")}
                    >
                        Moji zaposleni
                    </div>
                }


                {/* Zakazivanje sastanka */}
                {(jeAdmin || jeRukovodilac) &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/zakazivanje-sastanka")}
                    >
                        Zakaži sastanak
                    </div>
                }


                {/* Učesnici sastanka */}
                {(jeAdmin || jeRukovodilac) &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/ucesnici")}
                    >
                        Učesnici sastanka
                    </div>
                }


                {/* Evidentiranje prisustva */}
                {(jeAdmin || jeRukovodilac || jeZapisnicar) &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/prisustvo")}
                    >
                        Evidentiranje prisustva
                    </div>
                }


                {/* Predlozi */}
                {(jeAdmin || jeZapisnicar) &&
                    <div
                        className="meni-stavka"
                        onClick={() => idiNa("/predlozi")}
                    >
                        Predlozi
                    </div>
                }


                {/* Izveštaji */}
                <div
                    className="meni-stavka"
                    onClick={() => idiNa("/izvestaji")}
                >
                    Izveštaji
                </div>


                {/* Obaveštenja */}
                <div
                    className="meni-stavka"
                    onClick={() => idiNa("/obavestenja")}
                >
                    Obaveštenja
                </div>


                {/* Odjava */}
                <div
                    className="meni-stavka odjava-stavka"
                    onClick={() => {
                        localStorage.removeItem("korisnik");
                        navigate("/");
                    }}
                >
                    Odjavi se
                </div>

            </div>


            {/* ZATAMNJENA POZADINA */}
            {otvorenMeni &&
                <div
                    className="meni-overlay"
                    onClick={() => setOtvorenMeni(false)}
                >
                </div>
            }

        </>
    );
}

export default Meni;