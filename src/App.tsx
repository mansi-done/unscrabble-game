import React,{useState} from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';


function App() {
  const [letters, setLetters] = useState<number>(5)
  return (
    <div className="App">
      <div className="unscrabble"> unscramble</div>
      {/* <Settings letters={letters} setLetters={setLetters}/> */}
      <GameBoard letters={letters} />
    </div>
  );
}

export default App;
