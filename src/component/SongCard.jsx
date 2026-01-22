export default function SongCard({ title, artist, img, onPlay }) {
  return (
    <div
      className={`snap-center shrink-0 border border-black rounded-xl overflow-hidden w-45`}
      onClick={onPlay}
    >
      <img
        src={img}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "../src/assets/adult-3086302_1280.jpg";
        }}
        className="song-image w-full h-47.5 object-cover rounded-lg"
      />
      <p className="mt-2 text-sm text-white font-poppins pl-1">{title}</p>
      <p className="text-xs text-gray-400 pl-1">{artist}</p>
    </div>
  );
}
