import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice";
// UI COMPONENTS
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Spinner from "../../components/layout/Spinner";
import styles from "../../styles/user/Register.module.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    if (password !== confirmPassword) {
      toast.error("Invalid credentials");
    } else {
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };
      dispatch(register(userData));
    }
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
        <h1>Register User</h1>

        <div className="formgrid grid">
          {/* First Name */}
          <div className="field col-6">
            <span className="p-float-label">
              <InputText
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={onChange}
                style={{ width: "100%" }}
                autoFocus
              />
              <label htmlFor="firstName">First Name</label>
            </span>
          </div>

          {/* Last Name */}
          <div className="field col-6">
            <span className="p-float-label">
              <InputText
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={onChange}
                style={{ width: "100%" }}
              />
              <label htmlFor="lastName">Last Name</label>
            </span>
          </div>

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
              />
              <label htmlFor="email">E-mail</label>
            </span>
          </div>

          {/* Password */}
          <div className="field col-6">
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

          {/* Confirm Password */}
          <div className="field col-6">
            <span className="p-float-label">
              <Password
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                toggleMask
                className={styles.passwordField}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </span>
          </div>

          {/* Submit Button */}
          <div className="field col-12">
            <Button
              type="submit"
              label="Register"
              icon="pi pi-user-plus"
              iconPos="left"
            />
          </div>
        </div>
      </form>
    </section>
  );
}

export default Register;
