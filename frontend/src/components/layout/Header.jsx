import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useQuery({ queryKey: ["user"] });
  const userLocal = localStorage.getItem("user");
  const loggedInMenu = useRef(null);
  const loggedOutMenu = useRef(null);

  const onLogout = () => {
    queryClient.removeQueries({ queryKey: ["user"] });
    localStorage.removeItem("user");
    navigate("/login");
  };

  const mutation = useMutation({
    mutationFn: () => {
      if (userLocal) {
        return JSON.parse(userLocal);
      }
    },
    onSuccess: (user) => {
      console.log("User from storage: ");
      console.log(user);
      queryClient.setQueryData(["user"], user);
    },
  });

  useEffect(() => {
    if (!user || !user.data) {
      if (userLocal) {
        console.log("[Header.jsx] User detected in local storage, fetching...");
        mutation.mutate();
      }
    }
  }, []);

  const loggedInNavItems = [
    {
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-th-large",
          command: () => {
            if (user && user.data) {
              navigate("/dashboard");
            }
          },
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: onLogout,
        },
      ],
    },
  ];

  const loggedOutNavItems = [
    {
      items: [
        {
          label: "Register",
          icon: "pi pi-user-plus",
          command: () => navigate("/register"),
        },
        {
          label: "Login",
          icon: "pi pi-sign-in",
          command: () => navigate("/login"),
        },
      ],
    },
  ];

  const publicNav = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "About",
      icon: "pi pi-book",
      command: () => navigate("/about"),
    },
    {
      label: "Materials",
      icon: "pi pi-tags",
      command: () => navigate("/materials"),
    },
    {
      label: "Carports",
      icon: "pi pi-car",
      command: () => navigate("/carports"),
    },
    {
      label: "Calculator",
      icon: "pi pi-calculator",
      command: () => navigate("/calculator"),
    },
    {
      label: "Help",
      icon: "pi pi-question-circle",
      command: () => navigate("/help"),
    },
    {
      label: "Contact",
      icon: "pi pi-at",
      command: () => navigate("/contact"),
    },
  ];

  const userFunctions = () => {
    return (
      <>
        {user && user.data ? (
          <Button
            type="button"
            icon="pi pi-bars"
            label="Users"
            className="p-button-outlined p-button-primary"
            onClick={(event) => loggedInMenu.current.toggle(event)}
          ></Button>
        ) : (
          <Button
            type="button"
            icon="pi pi-bars"
            label="Users"
            className="p-button-outlined p-button-primary"
            onClick={(event) => loggedOutMenu.current.toggle(event)}
          ></Button>
        )}
      </>
    );
  };

  return (
    <header className="header">
      <Menu
        ref={loggedInMenu}
        model={loggedInNavItems}
        popup
        viewportheight={220}
        menuwidth={175}
      ></Menu>

      <Menu
        ref={loggedOutMenu}
        model={loggedOutNavItems}
        popup
        viewportheight={220}
        menuwidth={175}
      ></Menu>

      <Menubar model={publicNav} end={userFunctions} />
    </header>
  );
}

export default Header;
