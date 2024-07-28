import SvgClose from "./SvgClose";

export const GameOverModal = ({ setGameOver }) => {
  function handleClick(e) {
    if (e.target === e.currentTarget) {
      setGameOver(false);
      window.location.reload();
    }
  }

  document.addEventListener("keydown", onWindowEscape);
  function onWindowEscape(e) {
    if (e.code === "Escape") {
      setGameOver(false);
      window.location.reload();
      document.removeEventListener("keydown", onWindowEscape);
    }
  }

  function close() {
    setGameOver(false);
    window.location.reload();
  }

  return (
    <div className="overlay" onClick={handleClick}>
      <div className="modal">
        <button className="closeButton" onClick={close} aria-label="close">
          <SvgClose />
        </button>
        <h1>Game Over!</h1>
      </div>
    </div>
  );
};
