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
import Obavestenja from "./stranice/Obavestenja";
import ZasticenaRuta from "./ZasticenaRuta";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/korisnici" element={
          <ZasticenaRuta dozvoljeneUloge={["administrator"]}>
              <Korisnici/>
            </ZasticenaRuta>}/>

        <Route path="/dodela-uloge" element ={
          <ZasticenaRuta dozvoljeneUloge={["administrator"]}>
             <DodelaUloge/>
          </ZasticenaRuta>}/>

        <Route path="/sastanci" element= {<Sastanci/>}/>
        <Route path="/zakazivanje-sastanka" element= {
          <ZasticenaRuta dozvoljeneUloge={["administrator", "rukovodilac"]}>
            <ZakazivanjeSastanka/>
              </ZasticenaRuta>}/>

        <Route path="/ucesnici" element= {
          <ZasticenaRuta dozvoljeneUloge={["administrator", "rukovodilac"]}>
            <Ucesnici/>
          </ZasticenaRuta>}/>

        <Route path="/prisustvo" element= {
          <ZasticenaRuta dozvoljeneUloge={["rukovodilac", "administrator", "zapisnicar"]}>
           <Prisustvo/>
            </ZasticenaRuta>}/>

        <Route path="/predlozi" element= {
          <ZasticenaRuta dozvoljeneUloge={["zapisnicar", "administrator"]}>
            <Predlozi/>
            </ZasticenaRuta>}/>
         <Route path="/izvestaji" element={<Izvestaji />} />
         <Route path="/obavestenja" element={<Obavestenja />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;