import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./stranice/Login";
import Dashboard from "./stranice/Dashboard";
import Korisnici from "./stranice/Korisnici";
import DodelaUloge from "./stranice/DodelaUloge";
import Sastanci from "./stranice/Sastanci";
import ZakazivanjeSastanka from "./stranice/ZakazivanjeSastanka";
import Ucesnici from "./stranice/Ucesnici";
import Prisustvo from "./stranice/Prisustvo";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;