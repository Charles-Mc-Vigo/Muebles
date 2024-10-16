import React from "react";
import DesktopHeader from "./DesktopHView";
import MobileHeader from "./MobileHView";

const Header = () => {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>
    </>
  );
};

export default Header;
