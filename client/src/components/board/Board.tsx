import React, { useState, useEffect } from "react";
import { columnHeaders, rowHeaders } from "../../utils/boardHeaders";
import { toast } from "react-toastify";
import socket from "../../socket";
import "./Board.css";

interface BoardProps {
  boardData: (number | null)[][];
  setBoardData: React.Dispatch<React.SetStateAction<(number | null)[][]>>;
  isMyTurn: boolean;
  suggestions: (number | null)[][];
  displayedRollCount: number;
  clickedCell: [number | null, number | null];
  setClickedCell: React.Dispatch<
    React.SetStateAction<[number | null, number | null]>
  >;
}

const Board: React.FC<BoardProps> = ({
  boardData,
  setBoardData,
  isMyTurn,
  suggestions,
  displayedRollCount,
  clickedCell,
  setClickedCell,
}) => {
  const lobbyId = JSON.parse(localStorage.getItem("JoinedLobby") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const userId = user._id || "";

  const [delayedSuggestions, setDelayedSuggestions] = useState(suggestions);
  const [processedCells, setProcessedCells] = useState(
    Array(16)
      .fill(null)
      .map(() => Array(4).fill(false))
  );

  useEffect(() => {
    setDelayedSuggestions(suggestions);
  }, [suggestions]);

  useEffect(() => {
    socket.on("boardDataUpdated", (newBoardData) => {
      setBoardData(newBoardData);
    });
    return () => {
      socket.off("boardDataUpdated");
    };
  }, [setBoardData]);

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (!isMyTurn) {
      toast.error("It's not your turn");
      return;
    }

    // Handle announcement column (cellIndex === 3)
    if (cellIndex === 3) {
      if (
        clickedCell[0] === null &&
        clickedCell[1] === null &&
        displayedRollCount === 1
      ) {
        setClickedCell([rowIndex, cellIndex]);
        toast("Announced");
        return;
      } else if (clickedCell[0] === rowIndex && clickedCell[1] === cellIndex) {
        setClickedCell([null, null]);
        const newBoardData = [...boardData];
        newBoardData[rowIndex][cellIndex] = suggestions[rowIndex][cellIndex];
        setBoardData(newBoardData);

        setProcessedCells((prev) => {
          const newProcessedCells = [...prev];
          newProcessedCells[rowIndex][cellIndex] = true; // Mark cell as processed
          return newProcessedCells;
        });

        toast("Action processed");

        const newDelayedSuggestions = Array(16)
          .fill({ length: 16 })
          .map(() => Array(6).fill(null));
        setDelayedSuggestions(newDelayedSuggestions);

        socket.emit("playerAction", {
          lobbyId,
          userId,
          newBoardData,
        });
        return;
      } else {
        toast.error("You can only interact with the announced cell");
        return;
      }
    }

    if (clickedCell[0] !== null && clickedCell[1] !== null) {
      toast.error("You can only interact with the announced cell");
      return;
    }

    if (
      suggestions[rowIndex] &&
      suggestions[rowIndex][cellIndex] !== null &&
      cellIndex !== 3
    ) {
      const newBoardData = [...boardData];
      newBoardData[rowIndex][cellIndex] = suggestions[rowIndex][cellIndex];
      setBoardData(newBoardData);

      setProcessedCells((prev) => {
        const newProcessedCells = [...prev];
        newProcessedCells[rowIndex][cellIndex] = true; // Mark cell as processed
        return newProcessedCells;
      });

      const newDelayedSuggestions = Array(16)
        .fill({ length: 16 })
        .map(() => Array(6).fill(null));
      setDelayedSuggestions(newDelayedSuggestions);

      socket.emit("playerAction", {
        lobbyId,
        userId,
        newBoardData,
      });
    }
  };

  const getCellClassName = (
    cell: number | null,
    rowIndex: number,
    cellIndex: number
  ) => {
    let className = "";
    if (cell === null) {
      className += "disabled ";
    }
    if (delayedSuggestions[rowIndex][cellIndex] !== null && cell === null) {
      className += "suggested ";
    }
    if (processedCells[rowIndex][cellIndex]) {
      className += "perma-disabled ";
    }
    if (
      clickedCell[0] === rowIndex &&
      clickedCell[1] === cellIndex &&
      clickedCell[1] === 3
    ) {
      className += "announced ";
    }

    return className.trim(); // Remove trailing space
  };

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columnHeaders.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {boardData.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={rowHeaders[rowIndex] === "∑" ? "red" : ""}
          >
            <th>{rowHeaders[rowIndex]}</th>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
                className={getCellClassName(cell, rowIndex, cellIndex)}
              >
                {cell !== null ? cell : delayedSuggestions[rowIndex][cellIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
