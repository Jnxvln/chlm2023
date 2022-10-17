import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

function Header() {
  const navigate = useNavigate();
  const menu = useRef(null);

  const userNavItems = [
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
        {
          label: "Dashboard",
          icon: "pi pi-th-large",
          command: () => navigate("/dashboard"),
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => navigate("/logout"),
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
  return (
    <header className="header">
      <Menu
        ref={menu}
        model={userNavItems}
        popup
        viewportheight={220}
        menuwidth={175}
      ></Menu>

      <Menubar
        model={publicNav}
        end={
          <Button
            type="button"
            icon="pi pi-bars"
            label="Users"
            className="p-button-outlined p-button-primary"
            onClick={(event) => menu.current.toggle(event)}
          ></Button>
        }
      />
    </header>
  );
}

export default Header;
