import React, { useState } from "react";

const GRID_SIZE = 15;

const Gomoku = () => {
    const [board, setBoard] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [showWinner, setShowWinner] = useState(false);
    const [lastMove, setLastMove] = useState(null);

    const checkWinner = (board, row, col) => {
        const directions = [
            [1, 0],   // 水平
            [0, 1],   // 垂直
            [1, 1],   // 對角線
            [1, -1],  // 反對角線
        ];

        const player = board[row][col];
        
        for (const [dx, dy] of directions) {
            let count = 1;
            
            // 正向檢查
            for (let i = 1; i < 5; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (
                    newRow < 0 || newRow >= GRID_SIZE ||
                    newCol < 0 || newCol >= GRID_SIZE ||
                    board[newRow][newCol] !== player
                ) {
                    break;
                }
                count++;
            }
            
            // 反向檢查
            for (let i = 1; i < 5; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (
                    newRow < 0 || newRow >= GRID_SIZE ||
                    newCol < 0 || newCol >= GRID_SIZE ||
                    board[newRow][newCol] !== player
                ) {
                    break;
                }
                count++;
            }

            if (count >= 5) return player;
        }
        return null;
    };

    const handleClick = (row, col) => {
        if (board[row][col] || winner) return;

        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = isXNext ? "X" : "O";
        
        const gameWinner = checkWinner(newBoard, row, col);
        if (gameWinner) {
            setWinner(gameWinner);
            setShowWinner(true);
        }

        setBoard(newBoard);
        setIsXNext(!isXNext);
        setLastMove([row, col]);
    };

    const resetGame = () => {
        setBoard(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
        setIsXNext(true);
        setWinner(null);
        setShowWinner(false);
        setLastMove(null);
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">五子棋</h1>
            
            <div className="mb-4 text-xl font-semibold">
                {!winner && (
                    <div className="flex items-center gap-2">
                        下一步：
                        <span className={`${isXNext ? 'text-blue-600' : 'text-red-600'}`}>
                            {isXNext ? "X" : "O"}
                        </span>
                    </div>
                )}
            </div>

            <div className="relative bg-yellow-100 p-4 rounded-lg shadow-lg">
                <div className="grid gap-0">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {row.map((cell, colIndex) => {
                                const isLastMove = lastMove && 
                                    lastMove[0] === rowIndex && 
                                    lastMove[1] === colIndex;
                                
                                return (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`
                                            w-8 h-8 
                                            border border-gray-800
                                            flex items-center justify-center
                                            relative
                                            hover:bg-yellow-200
                                            transition-colors
                                            ${rowIndex === 0 ? 'border-t-2' : ''}
                                            ${rowIndex === GRID_SIZE - 1 ? 'border-b-2' : ''}
                                            ${colIndex === 0 ? 'border-l-2' : ''}
                                            ${colIndex === GRID_SIZE - 1 ? 'border-r-2' : ''}
                                            ${isLastMove ? 'bg-yellow-300' : ''}
                                        `}
                                        onClick={() => handleClick(rowIndex, colIndex)}
                                        disabled={!!winner || !!cell}
                                    >
                                        {cell && (
                                            <div className={`
                                                absolute w-6 h-6 
                                                rounded-full 
                                                flex items-center justify-center
                                                font-bold text-lg
                                                ${cell === 'X' ? 
                                                    'bg-blue-600 text-white' : 
                                                    'bg-red-600 text-white'}
                                                transform transition-transform
                                                ${isLastMove ? 'scale-90' : 'scale-100'}
                                            `}>
                                                {cell}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={resetGame}
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                         transition-colors duration-200 font-semibold"
            >
                重新開始
            </button>

            {/* 獲勝彈窗 */}
            {showWinner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-gray-800">
                        <h2 className="text-2xl font-bold mb-4">遊戲結束！</h2>
                        <p className="text-lg mb-6">
                            恭喜 {winner} 獲勝！
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={resetGame}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                                         transition-colors duration-200"
                            >
                                開始新遊戲
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gomoku;