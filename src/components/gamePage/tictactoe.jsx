import React, { useState } from "react";

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null)); // 初始化9格棋盤
    const [isXNext, setIsXNext] = useState(true); // 判斷是X還是O
    const [winner, setWinner] = useState(null); // 儲存遊戲勝者

    // 檢查是否有贏家
    const checkWinner = (board) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // 返回勝者 X 或 O
            }
        }

        return null;
    };

    // 處理格子點擊
    const handleClick = (index) => {
        if (board[index] || winner) return; // 如果格子已被選擇或遊戲結束，則不做任何事

        const newBoard = board.slice();
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const currentWinner = checkWinner(newBoard);
        if (currentWinner) {
            setWinner(currentWinner);
        }
    };

    // 重置遊戲
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
            {winner ? (
                <div className="text-xl font-bold text-green-500 mb-4">
                    Winner: {winner}
                </div>
            ) : (
                <div className="text-lg mb-4">
                    Next Player: {isXNext ? "X" : "O"}
                </div>
            )}
            <div className="grid grid-cols-3 gap-1 mb-4">
                {board.map((value, index) => (
                    <button
                        key={index}
                        className="w-24 h-24 bg-gray-300 flex items-center justify-center text-3xl font-bold"
                        onClick={() => handleClick(index)}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <button
                onClick={resetGame}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Restart Game
            </button>
        </div>
    );
};

export default TicTacToe;
