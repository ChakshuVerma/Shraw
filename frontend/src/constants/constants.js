export const DrawingActions = Object.freeze({
  DRAW_LINE: "line",
  DRAW_RECTANGLE: "rectangle",
  DRAW_ELLIPSE: "ellipse",
  DRAW_SCRIBBLE: "scribble",
  TOOL_MOVE: "move",
});

export const ShapeFill = Object.freeze({
  SOLID: "solid",
  HATCH: "hatch",
});

export const APIEndpoints = Object.freeze({
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  VERIFY_EMAIL: "/api/auth/verify-email",
  CONVERSATION: "/api/conversations",
  MESSAGE: "/api/messages",
  SOCKET_SERVER: import.meta.env.VITE_SOCKET_SERVER,
});

export const HomepageNavigations = Object.freeze([
  {
    name: "Login",
    link: "/login",
  },
  {
    name: "Register",
    link: "/signup",
  },
]);

export const HomePagePhrases = Object.freeze([
  "Collaborate",
  "Create",
  "Innovate",
  "Ideate",
  "Coordinate",
]);

export const ShrawFeatures = Object.freeze([
  {
    title: "Collaboration",
    description:
      "Shraw allows you to collaborate with your friends and team members to bring your ideas to life in a fun and interactive way.",
  },
  {
    title: "Huge arsenal of tools",
    description:
      "Shraw provides a wide range of tools as building blocks which allows you to create pretty much everything from a simple box to a complex structure",
  },
  {
    title: "Real-time updates",
    description:
      "Shraw provides real-time updates to all the users in the room so that everyone is on the same page and can work together seamlessly",
  },
  {
    title: "Cloud-storage",
    description:
      "Shraw provides cloud storage to save your work so that you do not lose your efforts and can access it from anywhere and anytime",
  },
  {
    title: "User-friendly",
    description:
      "Shraw is designed to be user-friendly and intuitive so that you can focus on your creativity and not on learning how to use the tool",
  },
  {
    title: "Online users",
    description:
      "Shraw provides a list of online users in the room so that you can see who is online and collaborate with them",
  },
  {
    title: "Export",
    description:
      "Shraw allows you to export your work so that you can share it with others and use it in your projects",
  },
]);

export const AppName = "Shraw";

export const Testimonials = Object.freeze([
  {
    userName: "John Doe",
    review:
      "Shraw is an amazing tool that allows me to collaborate with my team members and bring our ideas to life in a fun and interactive way. Highly recommended!",
  },
  {
    userName: "Jane Doe",
    review:
      "Shraw is a game-changer! It provides a wide range of tools and real-time updates that make it easy to work together with my friends and create amazing things. Love it!",
  },
  {
    userName: "Alice Smith",
    review:
      "Shraw is the best tool I have ever used for collaboration. It is user-friendly, intuitive, and provides cloud storage to save my work. I can't imagine working without it now!",
  },
  {
    userName: "Bob Johnson",
    review:
      "Shraw is a must-have for anyone who wants to collaborate with others and create amazing things. It provides online users list, export feature, and much more. Try it now!",
  },
]);

export const ComingSoon = Object.freeze([
  "Room chat",
  "More tools",
  "User roles",
  "Notifications",
  "Room settings",
]);
