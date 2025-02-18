/* eslint-disable react/prop-types */

const InputField = ({
  label,
  placeholder,
  type = "text",
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="text-white text-base md:text-lg mb-2 block font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full h-12 rounded-lg bg-white/90 text-gray-800 placeholder:text-gray-500 text-sm pl-10 pr-4 py-2 border-2 border-transparent focus:border-blue-400 focus:outline-none transition-colors duration-200"
          {...props}
        />
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
