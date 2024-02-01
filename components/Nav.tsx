export function Nav() {
  return (
    <nav
      className={`flex flex-row justify-between items-center w-full bg-zinc-900 p-2 px-4 border-b border-zinc-600 h-[48px]`}
    >
      <div className={`flex gap-2 items-center`}>
        <img
          src="https://www.svgrepo.com/show/217552/keyboard-piano.svg"
          alt="Keyboard Piano"
          style={{ height: "35px" }}
        />
        <h3 className={`font-mono text-sm`}>MidiGPT</h3>
      </div>
      <div>
        <button
          className={`flex items-center justify-betweenbg-zinc-700 border border-teal-800 hover:bg-teal-600 text-white px-2 rounded transition-all uppercase text-sm h-8`}
        >
          <span
            className={`text-xs bg-teal-700 text-white px-2 py-1 rounded-full mr-2`}
          >
            3
          </span>
          Credits
        </button>
      </div>
    </nav>
  );
}
