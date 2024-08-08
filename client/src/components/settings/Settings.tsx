import { useState, useEffect, useRef } from "react";
import BackgroundMusic from "./BackgroundMusic";

import "./Settings.css";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalOverlayRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        modalOverlayRef.current &&
        !modalOverlayRef.current.contains(e.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div className="settings">
      <button className="settings-button" onClick={openModal}>
        ⚙️
      </button>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalOverlayRef}>
            <h1>Settings</h1>
            {/* Close button */}
            <div className="close-modal close-button" onClick={closeModal}>
              X
            </div>
            <BackgroundMusic />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
