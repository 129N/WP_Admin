import React, { useState } from "react"
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";
import '../pages/layouts/Registration.css';
import Header from "../comp/header";

const Registration: React.FC = () => {

    const navigate = useNavigate();
    const [role, setRole] = useState<"competitor" | "admin" | "">("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);

    const [success, setSuccess] = useState(false);


    const handleRegister = async() => {

        try{
            if (!role || !email || !password || !name) {
            alert("Please fill all fields.");
            return;
            }

            const res = await fetch(`${BASE_URL}/register`, {
                method : 'POST', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { email, password,role, name,}
                ),
            });


            const data = await res.json();
            if(res.ok) {
                console.log('Registration has been succeeded');
             alert('Registration Successful!');
             setSuccess(true);
            } else{
                console.log('Failed', data);
            }
        }
        catch(err:any){
        console.error("Registration Error:", err);
        alert(err.response?.data?.message || "Registration failed.");
      }

    };
    
    const handleDelete = async() => {
        console.log('Delete is in the process');

        const token = await localStorage.getItem('token');

        try{
            const res = await fetch(`${BASE_URL}/registered_users`, {
                method: 'DELETE',
                headers:{
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({email, password, role, name}),
            });
            const result = await res.json();

            if(res.ok){
                console.log('Data deleted successfully!');
                alert('Data deleted successfully!');
            }
            else{
                console.error('Delete failed:', result);
                alert('Error deleting data');
            }
        }
        catch(err){
            console.log(err, "The delete is falied");
            alert("Failed to delete data.");
        } 
    };

    const fetchUsers = async() => {
 // after login or register (backend returns token)
      const token = await localStorage.getItem('token');

        try{
          const response = await fetch (`${BASE_URL}/registered_users`,{
            headers : {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
        });
        const data = await response.json();
          if(response.ok){

          console.log("Fetched user:", data.users);
            setFetchedUsers(data.users);
            alert('Fetching successful');

          } else {
            console.warn("Failed to fetch:", data);
          }
        } 
        catch(geterr){
          console.log('The GET mwthod', geterr)
        }
    };

    const testConnection = async() => {
        console.log('Fetch is in process');
        try{
            const res = await fetch(`${BASE_URL}/ping`);
            const text = await res.text();
            console.log('PING:', text);
        }catch(err){
            console.log(err, "Fetching Failed");
        } alert("Not Connected");

    };

   const handleAlert = async() => {
    const confirmed = window.confirm("Would you like to go to the login page?");
        if (confirmed) {
        navigate("../src/Authentication"); // same as router.replace() in RN
    }
   };

    return(
 <div className="registration-container">
    <Header/>
      <h2>Registration</h2>

      <div className="role-section">
        <h3>Select Role:</h3>
        <div className="role-buttons">

            <button
                className={`role-btn ${role === "competitor" ? "active" : ""}`}
                onClick={() => setRole("competitor")}
            >
                Competitor
            </button>
            <button
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
            >
                Admin
  </button>
 
 
        </div>
      </div>

      <div className="form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="button-button-group">

          <button className="btn register" onClick={handleRegister}>
            Register
          </button>
          <button className="btn fetch" onClick={fetchUsers}>
            Fetch
          </button>

        <button className="btn delete" onClick={handleDelete}>
            Delete Data
          </button>
          <button className="btn test" onClick={testConnection}>
            Connection Test
          </button>
        </div>
      </div>

        <div className="Access Login">
            {success ? <button onClick={handleAlert}>
            Go to Login Page?
        </button> : <p>Please Login </p>} 

        </div>




      <div className="result">
        <h3>Fetched Users</h3>
        {fetchedUsers.length > 0 ? (
          fetchedUsers.map((user, index) => (
            <div key={index} className="user-card">
              <p>📧 {user.email}</p>
              <p>🎭 {user.role}</p>
              <p>👤 {user.name}</p>
            </div>
          ))
        ) : (
          <p className="no-data">No data fetched yet.</p>
        )}
      </div>
    </div>
    );
};

export default Registration;
