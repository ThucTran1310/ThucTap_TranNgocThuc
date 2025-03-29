const Card = ({ children }) => {
    return (
        <div className="border border-gray-300 rounded-lg shadow-md p-4 bg-white">
            {children}
        </div>
    );
};

export default Card;
