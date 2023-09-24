import "./Login.css";

export default function Login() {
  return (
    <div className="login">
      <h1>Login</h1>
      <div className="login-form">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
}
