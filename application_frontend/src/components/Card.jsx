import React from "react";

const Card = ({
  title,
  value,
  icon,
  color = "bg-blue-500",
  textColor = "text-white",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-5 border">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-gray-500 text-sm font-medium">
            {title}
          </h4>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${color} ${textColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;