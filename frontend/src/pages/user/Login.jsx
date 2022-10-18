import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/layout/Spinner";
import styles from "../../styles/user/Register.module.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password
    }

    dispatch(login(userData))
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <form className={styles.registerForm} onSubmit={onSubmit}>
        <h1>User Login</h1>

        <div className="formgrid grid">
          {/* Email */}
          <div className="field col-12">
            <span className="p-float-label">
              <InputText
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                style={{ width: "100%" }}
                autoFocus
              />
              <label htmlFor="email">E-mail</label>
            </span>
          </div>

          {/* Password */}
          <div className="field col-12">
            <span className="p-float-label">
              <Password
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                toggleMask
                className={styles.passwordField}
              />
              <label htmlFor="password">Password</label>
            </span>
          </div>

          {/* Submit Button */}
          <div className="field col-12">
            <Button
              type="submit"
              label="Login"
              icon="pi pi-sign-in"
              iconPos="left"
            />
          </div>
        </div>
      </form>
    </section>
  );
}

export default Login;
