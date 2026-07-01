import "./Login.css";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-content">
          <h1>🏥 Hospital Mini ERP</h1>

          <h3>Smart Healthcare Management System</h3>

          <p>
            Manage patients, doctors, appointments and billing from one secure
            platform.
          </p>
        </div>
      </div>

      <div className="login-right">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
