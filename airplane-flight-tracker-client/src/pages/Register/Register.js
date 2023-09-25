import "./Register.css";

export default function Register() {
  return (
    <div className="register">
      <h1>Register</h1>
      <div className="register-form">
        <input type="email" placeholder="E-mail" />
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Register</button>
      </div>
    </div>
  );
}
