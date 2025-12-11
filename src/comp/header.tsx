import React from "react"
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import  { Colors } from "./constants/Colors";
import { GoGear } from "react-icons/go";
import { iconSize_dimension } from "./constants/dimensions";
import { IoHome } from "react-icons/io5";
const Header: React.FC = () => {

    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);
    const handleOpenSettings = () => navigate("/settings");
    const handleHome = () => navigate("/");

    return (
          <header className="header-container">
            <button className="header-btn" onClick={handleGoBack}>
                    <IoIosArrowBack size={iconSize_dimension.lg} color= {Colors.BTN.green }/>
            </button>

            <button className="header-btn" onClick={handleHome}>
                <IoHome size={iconSize_dimension.lg} color= {Colors.BTN.black } />
            </button>

            <button className="header-btn" onClick={handleOpenSettings}>
                <GoGear size={iconSize_dimension.lg} color= {Colors.BTN.black } />
            </button>

        </header>
    );
};

export default Header;
