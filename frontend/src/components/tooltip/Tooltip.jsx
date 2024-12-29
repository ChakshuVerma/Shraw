// eslint-disable-next-line react/prop-types
const Tooltip = ({ message, children }) => {
  return (
    <div className="group relative">
      {children}
      <span className="absolute scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 top-11">
        {message}
      </span>
    </div>
  );
};

export default Tooltip;
