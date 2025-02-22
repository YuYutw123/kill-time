import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Game2048 from "./components/gamePage/2048";
import Minesweeper from "./components/gamePage/sweeper";
import Gomoku from "./components/gamePage/gomoku";
import TicTacToe from "./components/gamePage/tictactoe";

function App() {
    return (
        <Router>
            <div className="flex bg-blue-900 w-screen">
                <Sidebar />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Game2048 />} />
                        <Route path="/minesweeper" element={<Minesweeper />} />
                        <Route path="/gomoku" element={<Gomoku />} />
                        <Route path="/tictactoe" element={<TicTacToe />} />

                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
