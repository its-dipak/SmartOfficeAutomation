import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login as loginApi } from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
  username: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginApi(data);

      login(response.token);

      toast.success("Login successful");

      const from =
        (location.state as { from?: string } | null)?.from ||
        "/dashboard";

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">S</div>

          <div>
            <h1>SmartOffice</h1>
            <p>Workplace Management Platform</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              {...register("username", {
                required: "Username is required",
              })}
            />

            {errors.username && (
              <span className="form-error">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <span className="form-error">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-footer">
          SmartOffice Management System
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
