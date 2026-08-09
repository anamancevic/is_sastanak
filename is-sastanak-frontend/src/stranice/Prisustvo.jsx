import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Prisustvo() {
    const navigate = useNavigate();

    const[sastanci, setSastanci] = useState([]);
    const[ucesnici, setUcesnici] = useState([]);
    const[sastanakId, setSastanakId] = useState("");
    const[poruka, setPoruka] = useState("");

    useEffect(()=> {
        async function ucitaj() {
           try {
            const s = await fetch("http://localhost:8080/api/sastanci");
            setSastanci(await s.json());
           } catch (greska) {
            console.log("Greska pri ucitavanju!");
           } 
        }
        ucitaj();
    }, []);

    async function ucitajUcesnike(id) {
        try {
            const odgovor = await fetch("http://localhost:8080/api/sastanci/" + id + "/ucesnici");
            setUcesnici(await odgovor.json());

        } catch (greska) {
            console.log("Greska pri ucitavanju ucesnika!");
        }
        
    }
}