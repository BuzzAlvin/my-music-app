const categories = [
  "all",
  "party",
  "afrosongs",
  "blues",
  "hip-hop",
  "carribean",
  "country",
  "instrumental",
  "rock",
  "podcast",
  "electronic",
  "latin",
];

export default function CategoriesBar({ activeCategory, onSelect }) {
  return (
    <section>
      <h2 className="font-poppins font-semibold text-2xl text-white capitalize mb-3">
        select categories
      </h2>
      <div className="categories-bar flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`capitalize bg-black rounded-full shrink-0 px-3 py-1 text-sm text-white border duration-300 cursor-pointer snap-start 
                ${
                  activeCategory === category
                    ? "bg-green-600"
                    : "bg-black text-white"
                }`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>

  );
}
