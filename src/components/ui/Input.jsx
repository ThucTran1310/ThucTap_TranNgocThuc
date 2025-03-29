const Input = ({ placeholder }) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className="border border-gray-300 rounded-md p-2 w-full"
        />
    );
};

export default Input;
