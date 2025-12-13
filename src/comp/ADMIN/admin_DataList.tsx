import { useEffect, useState } from "react";
import { BASE_URL } from "../../App";
import"./Layout/Datalist.css";
import Header from "../header";
  type UserItem = {
    email?: string;
    role?: string;
  };

const Datalist: React.FC = () =>{

    const [fectchedUsers, setFetchedUser] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    //const [users, setUsers] = useState<{email:string; role:string}[]>([]);

    const fetchList = async() => {

        const token = localStorage.getItem('authToken');
        console.log("Fetch is in progress", token);
        if(!token) {
             alert('No token found. Please log in again.');
            return;
        }
        try{

            const res = await fetch(`${BASE_URL}/registered_users`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept:'application/json',
                },
            });

            const data = await res.json();

            if(res.ok){
                console.log("Fetched user:", data.users);
                setFetchedUser(data.users);
                alert('Fetching successful');
            } else{
                console.warn("Failed to fetch:", data);
            }

        }
        catch(GETERR){
            console.log('The GET method', GETERR)
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

return (
    <div className="listPage">
      <Header />

      <main className="listContent">
        <div className="listHeader">
          <h2>User List</h2>
          <button className="btn btn--primary" onClick={fetchList}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="listHint">Loading data…</p>
        ) : fectchedUsers.length === 0 ? (
          <p className="listHint">No users found.</p>
        ) : (
          <div className="listContainer">
            {fectchedUsers.map((item, index) => (
              <div key={index} className="listRow">
                <span className="email">{item.email}</span>
                <span className={`role role--${item.role}`}>
                  {item.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};



export default Datalist;
