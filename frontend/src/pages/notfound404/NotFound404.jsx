import { Link } from "react-router-dom";
const NotFound404 = () => {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center text-5xl font-bold">
      <div className="text-center">404! Page not found</div>
      <Link to="/">
        <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg px-5 py-2.5 text-3xl mt-8 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound404;
