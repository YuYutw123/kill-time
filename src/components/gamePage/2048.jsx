import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const GRID_SIZE = 4;

const getEmptyBoard = () =>
    Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(0));

const addRandomTile = (board) => {
    let emptyCells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === 0) emptyCells.push([r, c]);
        }
    }
    if (emptyCells.length === 0) return board;

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
};

const initializeBoard = () => {
    let newBoard = getEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    return newBoard;
};

const slideAndMerge = (row) => {
    let filtered = row.filter((num) => num);
    for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            filtered[i + 1] = 0;
        }
    }
    return filtered.filter((num) => num).concat(Array(GRID_SIZE).fill(0)).slice(0, GRID_SIZE);
};

const moveBoard = (board, direction) => {
    let newBoard = getEmptyBoard();
    if (direction === "left") {
        for (let r = 0; r < GRID_SIZE; r++) newBoard[r] = slideAndMerge(board[r]);
    } else if (direction === "right") {
        for (let r = 0; r < GRID_SIZE; r++) newBoard[r] = slideAndMerge([...board[r]].reverse()).reverse();
    } else if (direction === "up") {
        for (let c = 0; c < GRID_SIZE; c++) {
            let col = slideAndMerge(board.map((row) => row[c]));
            for (let r = 0; r < GRID_SIZE; r++) newBoard[r][c] = col[r];
        }
    } else if (direction === "down") {
        for (let c = 0; c < GRID_SIZE; c++) {
            let col = slideAndMerge(board.map((row) => row[c]).reverse()).reverse();
            for (let r = 0; r < GRID_SIZE; r++) newBoard[r][c] = col[r];
        }
    }
    return addRandomTile(newBoard);
};

const checkGameOver = (board) => {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === 0) return false;
        }
    }
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            let value = board[r][c];
            if (c < GRID_SIZE - 1 && board[r][c + 1] === value) return false;
            if (r < GRID_SIZE - 1 && board[r + 1][c] === value) return false;
        }
    }
    return true;
};

const Game2048 = () => {
    const [board, setBoard] = useState(() => initializeBoard());
    const [gameOver, setGameOver] = useState(false);

    const resetGame = () => {
        setBoard(initializeBoard());
        setGameOver(false);
    };

    const handleKeyDown = useCallback(
        (event) => {
            if (gameOver) return;
            let newBoard;
            if (event.key === "ArrowLeft") newBoard = moveBoard(board, "left");
            if (event.key === "ArrowRight") newBoard = moveBoard(board, "right");
            if (event.key === "ArrowUp") newBoard = moveBoard(board, "up");
            if (event.key === "ArrowDown") newBoard = moveBoard(board, "down");

            if (newBoard) {
                setBoard([...newBoard]);
                if (checkGameOver(newBoard)) setGameOver(true);
            }
        },
        [board, gameOver]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 w-full">
            <h1 className="text-4xl font-bold mb-6">2048</h1>
            {gameOver && <div className="text-3xl font-bold text-red-500">Game Over!</div>}
            <button 
                onClick={resetGame} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
                Restart
            </button>
            <div className="grid grid-cols-4 gap-2 bg-gray-400 p-4 rounded-lg shadow-lg mt-4">
                {board.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                        <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-md 
                                ${value === 0 ? "bg-gray-300 text-gray-300" : 
                                value === 2 ? "bg-yellow-100 text-gray-800" : 
                                value === 4 ? "bg-yellow-200 text-gray-800" : 
                                value === 8 ? "bg-yellow-300 text-white" : 
                                value === 16 ? "bg-orange-400 text-white" : 
                                value === 32 ? "bg-orange-500 text-white" : 
                                value === 64 ? "bg-orange-600 text-white" : 
                                value === 128 ? "bg-red-400 text-white" : 
                                value === 256 ? "bg-red-500 text-white" : 
                                value === 512 ? "bg-red-600 text-white" : 
                                value === 1024 ? "bg-purple-500 text-white" : 
                                "bg-purple-600 text-white"
                                }`}
                            initial={{ scale: 0 }}  // 初始縮放值
                            animate={{ scale: 1 }}  // 動畫目標值
                            transition={{ type: "spring", stiffness: 200, damping: 20 }} // 動畫過渡效果
                        >
                            {value !== 0 ? value : ""}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Game2048;
