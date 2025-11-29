const QuickAccessCard = ({
  title,
  description,
  icon,
  onClick,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 ring-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100 ring-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100 ring-purple-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100 ring-orange-100",
    pink: "bg-pink-50 text-pink-600 hover:bg-pink-100 ring-pink-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ring-indigo-100",
  };

  return (
    <button
      onClick={onClick}
      className={`
        p-6 rounded-2xl border border-gray-100 
        transition-all duration-300 
        hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
        text-left w-full group
        ${colorClasses[color]}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]} ring-1`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg mb-1 group-hover:text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default QuickAccessCard;
