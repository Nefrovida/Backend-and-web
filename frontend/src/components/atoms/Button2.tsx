const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 text-sm font-medium rounded-md text-white ${className}`}
  >
    {children}
  </button>
);

export default Button;
