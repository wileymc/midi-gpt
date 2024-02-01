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
          className={`bg-teal-500 hover:bg-teal-700 text-white  py-1 px-2 rounded-full transition-all`}
        >
          Buy Credits
        </button>
      </div>
    </nav>
  );
}
