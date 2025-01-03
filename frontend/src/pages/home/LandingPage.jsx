import { Link } from "react-router-dom";
import shrawIcon from "../../../public/shraw_icon.png";
import canvasHeroImage from "../../assets/canvas_hero.png";
import Card from "@/components/testimonial/card";
import { MoveRight } from "lucide-react";
import {
  HomePagePhrases,
  HomepageNavigations,
  ShrawFeatures,
  AppName,
  Testimonials,
  ComingSoon,
} from "@/constants/constants";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [phrase, setPhrase] = useState("Collaborate");
  const [isHeroPhraseFading, setIsHeroPhraseFading] = useState(false);
  const [isFeatureDescFading, setIsFeatureDescFading] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialFading, setIsTestimonialFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsHeroPhraseFading(true);
      setTimeout(() => {
        setPhrase(
          (prev) =>
            HomePagePhrases[
              (HomePagePhrases.indexOf(prev) + 1) % HomePagePhrases.length
            ]
        );
        setIsHeroPhraseFading(false);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTestimonialFading(true);
      setTimeout(() => {
        setTestimonialIndex((prev) => (prev + 1) % Testimonials.length);
        setIsTestimonialFading(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (featureIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          featureIndex === ShrawFeatures.length - 1 ? 0 : featureIndex + 1;
        changeFeature(nextIndex);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          featureIndex === 0 ? ShrawFeatures.length - 1 : featureIndex - 1;
        changeFeature(prevIndex);
      } else if (e.key === "Escape" || e.key === "Enter") {
        changeFeature(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [featureIndex]);

  const changeFeature = (index) => {
    setIsFeatureDescFading(true);
    setTimeout(() => {
      setFeatureIndex((prev) => {
        return prev === index ? null : index;
      });
      setIsFeatureDescFading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col justify-start w-full scroll-y-auto">
      {/* Navbar and Hero Section */}
      <section className="min-h-screen w-full bg-gray-900 flex flex-col justify-start items-center px-2 pb-10 text-white">
        <nav className="flex items-start justify-between w-full flex-wrap p-2 sm:p-5">
          <div className="flex-grow flex items-stretch">
            <img
              src={shrawIcon}
              alt="Shraw Icon"
              height={30}
              width={30}
              className="inline mr-1"
            />
            <span className="text-3xl">
              <strong>{AppName}</strong>
            </span>
          </div>
          <div className="space-x-1 md:space-x-2 flex flex-row items-start">
            {HomepageNavigations.map((nav) => (
              <Link to={nav.link} key={nav.name}>
                <div
                  key={nav.name}
                  className="hover:bg-white hover:text-black py-2 px-4 rounded-full transition-all duration-300"
                >
                  <strong>{nav.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex-grow w-full flex justify-evenly items-stretch flex-wrap md:flex-nowrap">
          <div className="w-full sm:w-[40%] flex justify-center items-center lg:py-14">
            <img src={canvasHeroImage} alt="Canvas image" />
          </div>
          <div className="flex flex-col justify-start items-center lg:pt-20 sm:px-10 space-y-12">
            <h1 className="hidden md:block text-9xl font-bold w-full text-center ">
              {AppName}
            </h1>
            <div className="w-full flex-grow flex justify-start flex-col items-start">
              <h1 className="text-[1.8rem] lg:text-5xl font-bold text-start text-wrap mt-4 sm:mt-0">
                A new way to
                <span
                  className={` ml-2 underline transition-opacity duration-1000 ${
                    isHeroPhraseFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {phrase}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-wrap mt-2">
                Unleash your creativity - team up with friends and bring your
                ideas to life
              </p>
              <Link
                to="/signup"
                className="relative left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-orange-500 py-2 px-4 rounded-full mt-5 transition-all hover:bg-orange-700 duration-500 flex items-center">
                  <strong>Get Started</strong>
                  <MoveRight
                    className="w-4 h-4 ms-2"
                    style={{
                      strokeWidth: 4,
                    }}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full px-2 pt-16 lg:pt-24 pb-10 bg-gray-100">
        <div className="w-full flex flex-col lg:flex-row justify-evenly items-stretch lg:px-16">
          <div className="featList flex flex-row flex-wrap lg:flex-col justify-center lg:items-stretch">
            {ShrawFeatures.map((feature, index) => (
              <div
                tabIndex={0}
                key={index}
                className={`px-3 py-1 relative cursor-pointer hover:bg-gray-600 hover:text-white transition-all duration-200 uppercase rounded-full bg-black m-1 ${
                  featureIndex === index
                    ? "bg-white text-black lg:translate-x-10 border-2 border-black"
                    : "bg-black text-white"
                }
                `}
                onClick={() => changeFeature(index)}
              >
                <h1 className="text-sm md:text-lg lg:text-3xl font-bold whitespace-nowrap">
                  {feature.title}
                </h1>
              </div>
            ))}
          </div>
          <div className="featDescription flex-grow flex justify-center items-center p-10 lg:p-20">
            <span
              className={`text-xl lg:text-4xl text-wrap transition-opacity duration-1000 ${
                isFeatureDescFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {featureIndex === null ? (
                <span className="text-5xl lg:text-7xl font-bold">
                  WHY SHRAW?
                </span>
              ) : (
                <span>{ShrawFeatures[featureIndex].description}</span>
              )}
            </span>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="w-full px-2 pt-16 lg:pt-24 pb-10 bg-gray-100">
        <div className="w-full flex flex-col justify-center items-center">
          <span className="text-5xl lg:text-7xl font-bold underline text-center">
            WHAT OUR USERS SAY
          </span>
          <div
            className={`w-full justify-center items-center transition-opacity duration-1000 ${
              isTestimonialFading ? "opacity-0" : "opacity-100"
            } `}
          >
            <Card
              userName={Testimonials[testimonialIndex].userName}
              review={Testimonials[testimonialIndex].review}
            />
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <section className="w-full bg-gray-900 flex flex-col justify-center items-center py-5 text-white space-y-5">
        <div className="w-full flex justify-center items-stretch flex-wrap">
          <div className="text-2xl px-4 flex justify-center items-center">
            <span>
              <strong>WHAT&apos;S NEXT?</strong>
            </span>
          </div>
          <div className="flex flex-col space-y-2 px-24 py-5">
            {ComingSoon.map((item, index) => (
              <div key={index} className="flex flex-row space-x-2">
                <div className="text-xl">{item}</div>
              </div>
            ))}
          </div>
        </div>
        <span>
          Made with ❤️ by
          <a
            href="https://github.com/ChakshuVerma"
            target="_blank"
            rel="noreferrer"
            className="ml-2"
          >
            Chakshu
          </a>
        </span>
      </section>
    </div>
  );
};

export default LandingPage;
