import React, { useState, useEffect } from 'react';

const Flag = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 21H6V3H4V21ZM8 15H19L16 9L19 3H8V15Z" fill="#EF4444"/>
  </svg>
);

const Mine = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="#1F2937"/>
    <path d="M12 4V2M12 22V20M4 12H2M22 12H20M6.34 6.34L4.93 4.93M19.07 19.07L17.66 17.66M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34" 
          stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Minesweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagCount, setFlagCount] = useState(0);

  const BOARD_SIZE = 10;
  const MINES_COUNT = 10;

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() =>
      Array(BOARD_SIZE).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let mines = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (row + i >= 0 && row + i < BOARD_SIZE &&
                  col + j >= 0 && col + j < BOARD_SIZE &&
                  newBoard[row + i][col + j].isMine) {
                mines++;
              }
            }
          }
          newBoard[row][col].neighborMines = mines;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setFlagCount(0);
  };

  // 新增：檢查某個位置是否在遊戲板範圍內
  const isValidCell = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  // 新增：獲取周圍的格子
  const getNeighbors = (row, col) => {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;
        if (isValidCell(newRow, newCol)) {
          neighbors.push([newRow, newCol]);
        }
      }
    }
    return neighbors;
  };

  // 修改：點擊數字時的處理
  const handleNumberClick = (row, col) => {
    if (!board[row][col].isRevealed || board[row][col].neighborMines === 0) {
      return;
    }

    const neighbors = getNeighbors(row, col);
    const flaggedCount = neighbors.reduce((count, [r, c]) => 
      count + (board[r][c].isFlagged ? 1 : 0), 0
    );

    // 如果旗子數量等於數字，揭開未標記的周圍格子
    if (flaggedCount === board[row][col].neighborMines) {
      let hitMine = false;
      const newBoard = [...board];

      neighbors.forEach(([r, c]) => {
        if (!newBoard[r][c].isFlagged && !newBoard[r][c].isRevealed) {
          if (newBoard[r][c].isMine) {
            hitMine = true;
            newBoard[r][c].isRevealed = true;
          } else {
            revealCell(r, c);
          }
        }
      });

      if (hitMine) {
        setGameOver(true);
      }
    }
  };

  const revealCell = (row, col) => {
    if (gameOver || win || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    const newBoard = [...board];
    
    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const floodFill = (r, c) => {
      if (!isValidCell(r, c) || newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) {
        return;
      }

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0) {
        getNeighbors(r, c).forEach(([nr, nc]) => floodFill(nr, nc));
      }
    };

    floodFill(row, col);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const toggleFlag = (row, col) => {
    if (gameOver || win || board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...board];
    if (!newBoard[row][col].isFlagged && flagCount >= MINES_COUNT) {
      return;
    }

    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagCount(flagCount + (newBoard[row][col].isFlagged ? 1 : -1));

    checkWin(newBoard);
  };

  const checkWin = (currentBoard) => {
    let unrevealedSafeCells = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!currentBoard[row][col].isMine && !currentBoard[row][col].isRevealed) {
          unrevealedSafeCells = true;
          break;
        }
      }
    }
    if (!unrevealedSafeCells) {
      setWin(true);
    }
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const getCellContent = (cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? <Flag /> : '';
    }
    if (cell.isMine) {
      return <Mine />;
    }
    return cell.neighborMines || '';
  };

  const getCellStyle = (cell) => {
    let style = 'w-8 h-8 border flex items-center justify-center font-bold cursor-pointer select-none ';
    
    if (!cell.isRevealed) {
      style += 'bg-gray-300 hover:bg-gray-400 ';
    } else {
      style += 'bg-gray-100 ';
    }

    if (cell.isRevealed && cell.neighborMines > 0) {
      const colors = ['text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600', 
                     'text-yellow-600', 'text-pink-600', 'text-orange-600', 'text-teal-600'];
      style += colors[cell.neighborMines - 1] + ' ';
    }

    return style;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 w-full h-full justify-center">
            <h1 className="text-4xl font-bold mb-6">踩地雷</h1>
      <div className="mb-4 flex gap-4 items-center justify-center">
        <button 
          onClick={initializeBoard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新開始
        </button>
        <div className="text-lg flex items-center gap-2">
          剩餘旗子: <Flag /> {MINES_COUNT - flagCount}
        </div>
        {gameOver && <div className="text-red-500 text-lg">遊戲結束!</div>}
        {win && <div className="text-green-500 text-lg">恭喜獲勝!</div>}
      </div>
      
      <div className="inline-block border-2 border-gray-400">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={getCellStyle(cell)}
                onClick={() => cell.isRevealed && cell.neighborMines > 0 
                  ? handleNumberClick(rowIndex, colIndex) 
                  : revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
              >
                {getCellContent(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minesweeper;