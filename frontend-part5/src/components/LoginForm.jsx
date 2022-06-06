import { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id="username"
            autoComplete="off"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          password
          <input
            id="password"
            autoComplete="off"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button id="login-button" type="submit">
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
