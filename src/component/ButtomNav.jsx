import {
  HomeIcon,
  PlayCircleIcon,
  QueueListIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "home", icon: HomeIcon },
  { label: "search", icon: MagnifyingGlassIcon },
  { label: "play", icon: PlayCircleIcon },
  { label: "library", icon: QueueListIcon },
  { label: "profile", icon: UserIcon },
];

export default function ButtomNav({ goTo, active, setActive }) {
  return (
    <section className=" fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] backdrop-blur-md shadow-xl rounded-full z-50">
      <nav className="flex items-center justify-between bg-black/10 border-2 border-white/20 x-3 py-2 rounded-full">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`flex items-center justify-center flex-col cursor-pointer transition-all duration-500 w-16 h-14 py-1 rounded-full ${
              active === label ? "bg-green-600 text-white" : ""
            }`}
            onClick={() => setActive(label)}
          >
            <Icon className="w-7 h-7 text-white" />
            <span className="capitalize text-[10px] text-white mt-1">
              {label}
            </span>
          </button>
        ))}
      </nav>
    </section>
  );
}
