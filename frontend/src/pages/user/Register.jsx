import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
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

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section>
      <form className={styles.registerForm}>
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
