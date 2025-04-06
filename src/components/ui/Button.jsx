const Button = ({ children, variant = "solid" }) => {
    const baseStyle = "px-4 py-2 rounded-md flex items-center space-x-2";
    const variantStyle =
        variant === "outline"
            ? "border border-gray-500 text-gray-700"
            : "bg-blue-500 text-white";

    return <button className={`${baseStyle} ${variantStyle}`}>{children}</button>;
};

export default Button;
