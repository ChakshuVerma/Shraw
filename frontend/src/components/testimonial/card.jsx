import { Quote } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Card = ({ userName, review }) => {
  const profilePic = "https://avatar.iran.liara.run/public";
  return (
    <section className=" dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
        <figure className="max-w-screen-md mx-auto">
          <Quote className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" />
          <blockquote>
            <p className="text-2xl font-medium text-gray-900 dark:text-white">
              &quot;{review}&quot;
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center mt-6 space-x-3">
            <img
              className="w-6 h-6 rounded-full"
              src={profilePic}
              alt="profile picture"
            ></img>
            <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
              <div className="pr-3 font-medium text-gray-900 dark:text-white">
                {userName}
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Card;
