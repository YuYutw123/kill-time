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
  const BOARD_SIZE = 10;
  const MINES_COUNT = 10;

  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [isFlagMode, setIsFlagMode] = useState(false);

  const initializeBoard = () => {
    // 創建空棋盤
    const newBoard = Array(BOARD_SIZE).fill().map(() =>
      Array(BOARD_SIZE).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // 隨機放置地雷
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // 計算每個格子周圍的地雷數
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
    setIsFlagMode(false);
  };

  const isValidCell = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

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

  const handleNumberClick = (row, col) => {
    if (!board[row][col].isRevealed || board[row][col].neighborMines === 0) {
      return;
    }

    const neighbors = getNeighbors(row, col);
    const flaggedCount = neighbors.reduce((count, [r, c]) => 
      count + (board[r][c].isFlagged ? 1 : 0), 0
    );

    if (flaggedCount === board[row][col].neighborMines) {
      let hitMine = false;
      const newBoard = board.map(row => [...row]);

      neighbors.forEach(([r, c]) => {
        if (!newBoard[r][c].isFlagged && !newBoard[r][c].isRevealed) {
          if (newBoard[r][c].isMine) {
            hitMine = true;
            newBoard[r][c].isRevealed = true;
          } else {
            revealCell(r, c, newBoard);
          }
        }
      });

      if (hitMine) {
        setGameOver(true);
      }
      setBoard(newBoard);
    }
  };

  const revealCell = (row, col, currentBoard = null) => {
    if (gameOver || win) return;

    const newBoard = currentBoard || board.map(row => [...row]);
    if (!isValidCell(row, col) || newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) {
      return;
    }

    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].isMine) {
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    if (newBoard[row][col].neighborMines === 0) {
      getNeighbors(row, col).forEach(([r, c]) => {
        revealCell(r, c, newBoard);
      });
    }

    if (!currentBoard) {
      setBoard(newBoard);
      checkWin(newBoard);
    }
  };

  const toggleFlag = (row, col) => {
    if (gameOver || win || board[row][col].isRevealed) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    if (!newBoard[row][col].isFlagged && flagCount >= MINES_COUNT) {
      return;
    }

    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagCount(flagCount + (newBoard[row][col].isFlagged ? 1 : -1));
    
    // 檢查是否所有炸彈都插上了旗子
    checkWin(newBoard);
  };

  const checkWin = (currentBoard) => {
    let unrevealedSafeCells = false;
    let allFlagsCorrect = true;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!currentBoard[row][col].isMine && !currentBoard[row][col].isRevealed) {
          unrevealedSafeCells = true;
        }
        // 檢查每顆地雷是否正確放置旗子
        if (currentBoard[row][col].isMine && !currentBoard[row][col].isFlagged) {
          allFlagsCorrect = false;
        }
      }
    }

    if (!unrevealedSafeCells && allFlagsCorrect) {
      setWin(true);
    }
  };

  const handleCellClick = (row, col) => {
    if (gameOver || win) return;

    const cell = board[row][col];
    
    if (isFlagMode) {
      toggleFlag(row, col);
    } else {
      if (cell.isRevealed && cell.neighborMines > 0) {
        handleNumberClick(row, col);
      } else {
        revealCell(row, col);
      }
    }
  };

  const handleLongPress = (row, col, e) => {
    e.preventDefault();
    if (!gameOver && !win) {
      toggleFlag(row, col);
    }
  };

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

  useEffect(() => {
    initializeBoard();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 min-h-screen w-full">
      <h1 className="text-4xl font-bold mb-6 text-white">踩地雷</h1>
      
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-center">
        <button 
          onClick={initializeBoard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新開始
        </button>
        
        <button 
          onClick={() => setIsFlagMode(!isFlagMode)}
          className={`px-4 py-2 rounded flex items-center gap-2 
            ${isFlagMode ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          <Flag /> {isFlagMode ? '插旗模式' : '點開模式'}
        </button>
        
        <div className="text-lg flex items-center gap-2 text-white">
          剩餘旗子: <Flag /> {MINES_COUNT - flagCount}
        </div>
      </div>

      {(gameOver || win) && (
        <div className={`text-lg mb-4 ${gameOver ? 'text-red-500' : 'text-green-500'}`}>
          {gameOver ? '遊戲結束!' : '恭喜獲勝!'}
        </div>
      )}
      
      <div className="inline-block border-2 border-gray-400 touch-none">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`
                  ${getCellStyle(cell)}
                  touch-none
                  ${isFlagMode && !cell.isRevealed ? 'bg-red-200 hover:bg-red-300' : ''}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleLongPress(rowIndex, colIndex, e)}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const element = e.target;
                  const startTime = new Date().getTime();
                  
                  const longPressTimer = setTimeout(() => {
                    handleLongPress(rowIndex, colIndex, e);
                  }, 500);

                  element.addEventListener('touchend', () => {
                    clearTimeout(longPressTimer);
                    const endTime = new Date().getTime();
                    if (endTime - startTime < 500) {
                      handleCellClick(rowIndex, colIndex);
                    }
                  }, { once: true });
                }}
              >
                {getCellContent(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 text-gray-300 text-sm">
        <p>電腦操作：左鍵點開，右鍵插旗</p>
        <p>手機操作：單點點開，長按插旗</p>
        <p>或使用上方按鈕切換模式</p>
      </div>
    </div>
  );
};

export default Minesweeper;