import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
// import { login, resetMessages } from "../../features/auth/authSlice";
import styles from "../../styles/user/Register.module.css";
// Data
import { login } from "../../api/users/usersApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Login() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Welcome!", { autoClose: 1000, toastId: 'welcome-toast' });
      navigate("/dashboard");
    },

    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  // if (authLoading) {
  //   return <Spinner />;
  // }

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
                required
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
                feedback={false}
                toggleMask
                className={styles.passwordField}
                required
              />
              <label htmlFor="password">Password</label>
            </span>
          </div>

          {/* Submit Button */}
          <div className="field col-12">
            <Button type="submit" label="Login" icon="pi pi-sign-in" iconPos="left" />
          </div>
        </div>
      </form>
    </section>
  );
}

export default Login;
