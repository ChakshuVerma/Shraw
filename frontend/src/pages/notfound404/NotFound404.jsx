import { Link } from "react-router-dom";
const NotFound404 = () => {
  return (
    <div className="flex justify-center items-center flex-col space-x-10 space-y-10 border border-black">
      <span>404</span>
      <Link to="/">
        <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound404;
