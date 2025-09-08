export default function StarRating({ rating, onRate }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`cursor-pointer text-2xl ${
            n <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRate(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
