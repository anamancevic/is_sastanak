import { Navigate } from "react-router-dom";

function ZasticenaRuta({children, dozvoljeneUloge}) {
    const korisnik = JSON.parse(localStorage.getItem("korisnik"));


    //ako korisnik nije prijavljen
    if (!korisnik) {
        return <Navigate to = "/" replace />;
    }

    //ako ruta trazi odredjene uloge proveri...
    if (dozvoljeneUloge && dozvoljeneUloge.length > 0) {
        const imaPravo = dozvoljeneUloge.some((uloge)=> korisnik.uloge.includes(uloge));
        if (!imaPravo) {
                return <Navigate to = "/dashboard" replace/>;
        }
    }
    //ako ima pravo prikazi mu ekran
    return children;
}
export default ZasticenaRuta;   