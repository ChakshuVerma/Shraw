import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true, // prevent XSS attacks Cross site scripting attacks
    sameSite: "strict", //  CSRF attacks Cross site request forgery attacks
  });
};

export default generateTokenAndSetCookie;
