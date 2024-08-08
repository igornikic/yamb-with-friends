import React, { useEffect } from "react";
import "./Dice.css";
import socket from "../../socket";
import { toast } from "react-toastify";

interface DiceState {
  value: number;
  rolling: boolean;
  rotation: string;
  locked: boolean;
}

interface DiceProps {
  diceStates: DiceState[];
  setDiceStates: React.Dispatch<React.SetStateAction<DiceState[]>>;
  displayedRollCount: number;
  setDisplayedRollCount: React.Dispatch<React.SetStateAction<number>>;
  isMyTurn: boolean;
  boardData: (number | null)[][];
  clickedCell: [number | null, number | null];
}

const Dice: React.FC<DiceProps> = ({
  diceStates,
  setDiceStates,
  displayedRollCount,
  setDisplayedRollCount,
  isMyTurn,
  boardData,
  clickedCell,
}) => {
  // MAYBE BETTER TO PUT ALL OF THIS IN GAME AND REMOVE FROM HERE
  const lobbyId = JSON.parse(localStorage.getItem("JoinedLobby") || "");
  const user = JSON.parse(localStorage.getItem("user") || "");
  const userId = user._id || "";

  const rollDice = () => {
    if (!isMyTurn) return;
    if (displayedRollCount < 3) {
      const newDiceStates = diceStates.map((dice) => {
        if (dice.locked) {
          return { ...dice, rolling: false };
        }
        const newValue = Math.floor(Math.random() * 6) + 1;
        return {
          value: newValue,
          rolling: true,
          rotation: getDiceRotation(newValue),
          locked: false,
        };
      });

      setDiceStates(newDiceStates);

      setTimeout(() => {
        setDiceStates((prevStates) => {
          const updatedStates = prevStates.map((state) => ({
            ...state,
            rolling: false,
          }));

          const diceValues = updatedStates.map((state) => state.value);
          socket.emit(
            "dicesRolled",
            {
              lobbyId,
              userId,
              diceValues,
              rollCount: displayedRollCount + 1,
              boardData,
              clickedCell,
            },
            (response: { success: boolean; message: string }) => {
              if (response.success) {
                console.log(response);
              } else {
                toast.error(`${response.message}`);
              }
            }
          );
          return updatedStates;
        });
        setDisplayedRollCount(displayedRollCount + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!isMyTurn) return;

    const initialDiceStates = diceStates.map((dice) => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      return {
        ...dice,
        value: newValue,
        rolling: true,
        rotation: getDiceRotation(newValue),
        locked: false,
      };
    });

    setDiceStates(initialDiceStates);

    setTimeout(() => {
      setDiceStates((prevStates) => {
        const updatedStates = prevStates.map((state) => ({
          ...state,
          rolling: false,
        }));
        const diceValues = updatedStates.map((state) => state.value);

        socket.emit(
          "dicesRolled",
          {
            lobbyId,
            userId,
            diceValues,
            rollCount: 1,
            boardData,
          },
          (response: { success: boolean; message: string }) => {
            if (response.success) {
              console.log(response);
            } else {
              toast.error(`${response.message}`);
            }
          }
        );
        return updatedStates;
      });
      setDisplayedRollCount(1);
    }, 1000);
  }, [isMyTurn]);

  const toggleLock = (index: number) => {
    setDiceStates((prevStates) =>
      prevStates.map((dice, i) =>
        i === index ? { ...dice, locked: !dice.locked } : dice
      )
    );
  };

  const getDiceRotation = (value: number) => {
    switch (value) {
      case 1:
        return "rotateX(0deg) rotateY(0deg)";
      case 2:
        return "rotateX(90deg) rotateY(0deg)";
      case 3:
        return "rotateX(0deg) rotateY(-90deg)";
      case 4:
        return "rotateX(0deg) rotateY(90deg)";
      case 5:
        return "rotateX(-90deg) rotateY(0deg)";
      case 6:
        return "rotateX(-180deg) rotateY(0deg)";
      default:
        return "rotateX(0deg) rotateY(0deg)";
    }
  };

  const renderRollSigns = () => {
    const signs = [];
    for (let i = 0; i < 3; i++) {
      signs.push(i < displayedRollCount ? "X" : "O");
    }
    return signs.join(" ");
  };

  return (
    <>
      <div className="dice-container">
        {diceStates.map((dice, index) => (
          <div
            key={index}
            className={`dice ${dice.rolling ? "rolling" : ""} ${
              dice.locked ? "locked" : ""
            }`}
            style={{ transform: dice.rotation }}
            onClick={() => toggleLock(index)}
          >
            <div className="face front">1</div>
            <div className="face back">6</div>
            <div className="face left">4</div>
            <div className="face right">3</div>
            <div className="face top">5</div>
            <div className="face bottom">2</div>
          </div>
        ))}
      </div>
      <div className="roll-btn-container">
        <button
          onClick={rollDice}
          disabled={
            diceStates.some((dice) => dice.rolling) || displayedRollCount >= 3
          }
        >
          {renderRollSigns()}
        </button>
      </div>
    </>
  );
};

export default Dice;
