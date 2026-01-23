export default function collectionCard({ img, title, onPlay }) {
  return (
    <div
      className="cursor-pointer snap-start shrink-0 w-92.5 h-70 rounded-xl overflow-hidden"
      onClick={onPlay}
    >
      <img
        className="song-image w-full h-70 object-cover rounded-xl mb-2"
        src={img}
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "../src/assets/adult-3086302_1280.jpg";
        }}
      />
    </div>
  );
}
