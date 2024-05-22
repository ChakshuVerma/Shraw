// import { Button } from "./components/ui/button";
import "./App.css";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import NotFound from "./pages/notfound404/NotFound404";
import VerifyUser from "./pages/verifyUser/VerifyUser";
import JoinConversation from "./pages/joinConversation/joinConversation";
import ChatPage from "./pages/ChatPage/chatPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/authContext";

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <div className="outer-container md:h-screen">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/verify-email"
            element={authUser ? <Navigate to="/" /> : <VerifyUser />}
          />
          <Route
            path="/join-conversation"
            element={!authUser ? <Navigate to="/" /> : <JoinConversation />}
          />
          <Route
            path="/deep-dive/:conversationId"
            element={!authUser ? <Navigate to="/" /> : <ChatPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
