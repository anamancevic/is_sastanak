import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sastanci() {
    const navigate = useNavigate();
    const[sastanci, setSastanci] = useState([]);

    useEffect(() => {
        async function ucitajSastanke() {
             try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci");
            const podaci = await odgovor.json();
            setSastanci(podaci);
        } catch (greska) {
            console.log("Greska pri ucitavanju sastanka!");
        }}
        ucitajSastanke();
    }, []);
    
    return(
        <div className="pozadina">
                <div className="kartica" style={{width: "80%", maxWidth: "1000px" }}>
                <h2 className="naslov">
                Sastanci
                </h2>
                {sastanci.map((s)=>(
                    <div key={s.id}
                   className="kartica2">
            <h3 className="podnaslov">
            {s.tema}
            </h3>
            <p className="tekst">
                Datum: {s.datumOdrzavanja}
            </p>
            <p className="tekst">
                Status: {s.status} 
            </p>
            <p className="tekst">
                Tip: {s.tip}
            </p>
            <p className="tekst">
            Kategorija: {s.kategorija.naziv}
            </p>
                        </div>
                ))}
                <button onClick={()=> navigate("/dashboard")}
                    className="dugme">
                            Nazad
                </button>
                </div>
        </div>
    )
}

export default Sastanci;