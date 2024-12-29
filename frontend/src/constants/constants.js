export const DrawingMethods = Object.freeze({
  LINE: "line",
  RECTANGLE: "rectangle",
  ELLIPSE: "ellipse",
  SCRIBBLE: "scribble",
});

export const ShapeFill = Object.freeze({
  SOLID: "solid",
  HATCH: "hatch",
});

export const APIEndpoints = Object.freeze({
  BASE_URL: "http://localhost:5000",
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  VERIFY_EMAIL: "/api/auth/verify-email",
  CONVERSATION: "/api/conversations",
  MESSAGE: "/api/messages",
  SOCKET_SERVER: "http://localhost:5000",
});
