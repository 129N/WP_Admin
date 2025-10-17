import React, { useEffect, useState } from "react";
import "./ProfileScreen.css"; // optional external CSS
import { FiEdit3 } from "react-icons/fi";
import { IoMailOutline, IoPersonCircle } from "react-icons/io5";
import { MdPassword } from "react-icons/md";

import Header from "../comp/header";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../App";
// import CustomInput from "../components/CustomInput"; // make sure it works in web too


const ProfileLogin: React.FC = () => {
    const [role, setRole] = useState<'admin' | 'competitor'>('competitor');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Login property 
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState ('');
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();

    //AsynchStorage
    useEffect(() => {

        const loadUserInfo = async () =>{
            const token = await localStorage.getItem('authToken');
            const email = await localStorage.getItem('userEmail');
            const role = await localStorage.getItem('userRole');
            const name = await localStorage.getItem('name');
            setIsLoggedIn(!!token);
            setUserEmail(email || '');
            setUserRole(role || '');
            setUserName(name || '' );
        };
        loadUserInfo();
    }, []);


    const handleLogin = async() => {
        try{

            if(!role){
                console.warn("Role is not defined");
              alert("Please select a role");
              return;
            }

      console.log("Login payload:", email, password);

         const response = await fetch(`${BASE_URL}/login_react`,{
             method: 'POST',
             headers: {
              'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                email,  // email input value
                password,  // password input value
            }),

          });

          const data = await response.json();

          if (response.ok) {

            const token = data.token;
            const roleFromApi = data.user.role;
            const userName = data.user.name;
            const email = data.user.email;
   
         
             if (!token) {
                console.warn("Token not returned by API");
                alert("Login failed. Token not received.");
                return;
            }
            
            await localStorage.setItem('userEmail', email);
            await localStorage.setItem('authToken', token);
            await localStorage.setItem('userRole', roleFromApi);
            await localStorage.setItem('name', userName);

            alert('Logged in as ' + roleFromApi);
            console.log("Login Success:", token);

                if (roleFromApi === 'admin') { // role is also ok.
                navigate('/admin'); // Route to admin screen
                } else {
                  navigate('/participant'); // Route to participant screen
                }

          } else {
            console.warn("Login Failed:", data.message || "Invalid credentials");
             alert(data.message || "Login failed. Please check your credentials.");
          }


        }catch(error){
            console.log("Error logging in:", error);
            alert("An error occurred. Please try again later.");
          }

    };

    const handleLogout = async() => {
         try{
               //await AsyncStorage.clear();
            const token = await localStorage.getItem('authToken');
          
        await localStorage.removeItem('userEmail');
            if(!token){
                alert('You are already logged out.');
                return;
            }

            //call backend (Laravel)
             const response = await fetch(`${BASE_URL}/logout`,{
                         method: 'POST',
                         headers: {
                            Authorization : `Bearer ${token}`, // It is needed to authenticate btw the server and the client.
                            Accept: 'application/json',
                        },
            });

            if(response.ok){

                await localStorage.multiRemove(['authToken', 'userRole', 'userId', 'userName']);

                // await AsyncStorage.clear();

                setIsLoggedIn(false);
                alert('Logged out !');
                navigate('/');
            } else{
                console.log("Token : " + response); // the [Object object] had shown mismatch of token. 
                alert('Logout failed. please try again');
            }
        }
        catch(error){
            console.log(error);
            alert("Error logging out");
        }
    };

  return (
    <div className="container">
      <Header />

      <div className="profileWrapper">
        <div className="profileImageContainer">
          {isLoggedin ? (
            <img
              className="profileImage"
              src="/assets/images/Fugen.png"
              alt="Profile"
            />
          ) : (
            <IoPersonCircle size={140} color="#000" />
          )}
          <button className="editIconContainer">
            <FiEdit3 size={20} color="#fff" />
          </button>
        </div>

        <div className="nameRoleContainer">
          <p className="infoText">Role: {isLoggedin ? userEmail : "Email"}</p>
          <p className="infoText">
            Account: {isLoggedin ? userRole : "Not Logged In"}
          </p>
          <p className="infoText">Name: {isLoggedin ? userName : "Guest"}</p>
        </div>

        <div className="inputFieldContainer">
          {!isLoggedin ? (
            <form onSubmit={handleLogin} >

 {/* Email input */}
        <div >
          <IoMailOutline size={20} color="#888"  />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div >
          <MdPassword size={20} color="#888" />
          <input
            type="password"
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

              <button className="button" onClick={handleLogin}>
                Next
              </button>
            </form>
          ) : (
            <button className="logoutButton" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLogin;
