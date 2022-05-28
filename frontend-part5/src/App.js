import { useState, useEffect } from "react";

import Notification from "./components/Notification";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Bloglist from "./components/Bloglist";

const App = () => {
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON));
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const userCred = await loginService.login({ username, password });
      setUser(userCred);
      await window.localStorage.setItem("loggedUser", JSON.stringify(userCred));
    } catch (exception) {
      handleNotification(exception.response.data.error, "error");
    }
  };

  const handleNotification = (exception, type = "normal") => {
    setNotification({ exception, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <>
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
      </div>
      {!user ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <Bloglist user={user} handleNotification={handleNotification} />
      )}
    </>
  );
};

export default App;
