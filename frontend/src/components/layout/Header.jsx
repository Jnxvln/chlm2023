import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../../features/auth/authSlice"

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth)

  const loggedInMenu = useRef(null);
  const loggedOutMenu = useRef(null);

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/login")
  }

  const loggedInNavItems = [
    {
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-th-large",
          command: () => navigate("/dashboard"),
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

  //   const UserNav = () => {
  //     return <SlideMenu model={userNavItems} />;
  //   };

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
      { user ? (<Button
        type="button"
        icon="pi pi-bars"
        label="Users"
        className="p-button-outlined p-button-primary"
        onClick={(event) => loggedInMenu.current.toggle(event)}
      ></Button>) : (<Button
        type="button"
        icon="pi pi-bars"
        label="Users"
        className="p-button-outlined p-button-primary"
        onClick={(event) => loggedOutMenu.current.toggle(event)}
      ></Button>) }
      </>
    )
  }

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

      <Menubar
        model={publicNav}
        end={userFunctions}
      />
    </header>
  );
}

export default Header;
