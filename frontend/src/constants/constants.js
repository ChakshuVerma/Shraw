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
