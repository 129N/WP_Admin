import { useEffect, useState } from "react";
import { BASE_URL } from "../../App";
import"./Layout/Datalist.css";
import Header from "../header";
  type UserItem = {
    email?: string;
    role?: string;
  };

const Datalist: React.FC = () =>{

    const [fectchedUsers, setFetchedUser] = useState< UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{email:string; role:string}[]>([]);

    const fetchList = async() => {
        

        const token = localStorage.getItem('authToken');

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
            console.log('The GET mwthod', GETERR)
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);


    return(
  <div className="styleContainer">
    <Header/>
      <h2 className="sectionTitle">Datalist.tsx</h2>

      <button className="button" onClick={fetchList}>
        Fetch
      </button>

      {loading ? (
        <p>Reload Please</p>
      ) : (
        <div className="listContainer">
          {fectchedUsers.map((item, index) => (
            <div key={index} className="participantCard">
              <p className="userText">📧 {item.email}</p>
              <p className="userText">🎭 {item.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    );
};


export default Datalist;
