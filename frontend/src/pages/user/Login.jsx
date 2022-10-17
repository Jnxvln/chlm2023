import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import styles from "../../styles/user/Register.module.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section>
      <form className={styles.registerForm}>
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
