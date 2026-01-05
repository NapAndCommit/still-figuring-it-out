"use client";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-neutral-50/80 backdrop-blur-sm border-b border-neutral-100 z-40">
      <div className="flex items-center h-full px-4">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:text-neutral-700 transition-colors duration-150 mr-3"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 15H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-sm font-normal text-neutral-600">
          Still Figuring It Out
        </h1>
      </div>
    </header>
  );
}

