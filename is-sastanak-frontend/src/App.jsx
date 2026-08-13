import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./stranice/Login";
import Dashboard from "./stranice/Dashboard";
import Korisnici from "./stranice/Korisnici";
import DodelaUloge from "./stranice/DodelaUloge";
import Sastanci from "./stranice/Sastanci";
import ZakazivanjeSastanka from "./stranice/ZakazivanjeSastanka";
import Ucesnici from "./stranice/Ucesnici";
import Prisustvo from "./stranice/Prisustvo";
import Predlozi from "./stranice/Predlozi";
import Izvestaji from "./stranice/Izvestaji";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/korisnici" element={<Korisnici/>}/>
        <Route path="/dodela-uloge" element ={<DodelaUloge/>}/>
        <Route path="/sastanci" element= {<Sastanci/>}/>
        <Route path="/zakazivanje-sastanka" element= {<ZakazivanjeSastanka/>}/>
        <Route path="/ucesnici" element= {<Ucesnici/>}/>
        <Route path="/prisustvo" element= {<Prisustvo/>}/>
        <Route path="/predlozi" element= {<Predlozi/>}/>
         <Route path="/izvestaji" element={<Izvestaji />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;