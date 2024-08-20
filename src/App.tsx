import { Info } from "./components/Info";
import { Map } from "./components/Map";
function App() {
  return (
    <div>
      <Info />
      <div className='map-container'>
        <Map />
      </div>
    </div>
  );
}

export default App;
