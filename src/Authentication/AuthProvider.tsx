import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BASE_URL } from '../App';
import { SiRoku } from 'react-icons/si';

type User = {
    id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuthContextType ={
    authToken: string | null;
    userRole: string | null;
    user: User;
    isLoggedIn: boolean;
    login: (token: string, role: string, user:NonNullable<User>) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext <AuthContextType> ({
    authToken: null,
    userRole: null,
    user: null,
    isLoggedIn: false,
    login: async () => {},
    logout: async () => {},
});


export const AuthProvider : React.FC<{children: ReactNode}>= ({children}) => {

    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        const loadInfo = async() =>{
            try{

            const token = localStorage.getItem("authToken");
            const role = localStorage.getItem("userRole");
            const storedUser = localStorage.getItem("user");

            if (token) setAuthToken(token);
            if (storedUser) setUser(JSON.parse(storedUser));
            if (role) setUserRole(role);
            }
            catch(err){
                console.error("Error loading auth data:", err);
            }finally{
            setLoading(false);
            }
        };

        const checkToken = async() =>{
            const token = localStorage.getItem("authToken");
            if (!token) return;

                try {
        const res = await fetch(`${BASE_URL}/user`, {
            headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            },
        });

        if (res.status === 401) {
            // Token invalid or expired → auto logout
            await logout();
        }
        } catch (err) {
        console.warn("Auth check failed:", err);
        }
        };

        checkToken();
        loadInfo();
    }, []);



const login = async(token: string, role:string, userData : NonNullable<User>)=>{
    try{
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("user", JSON.stringify(userData));

        localStorage.setItem("userId", userData.id.toString());
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userEmail", userData.email);
        
        setAuthToken(token);
        setUserRole(role);
        setUser(userData);
 
    }
    catch(err){
        console.error("Error saving login data:", err);
    }
};

const logout = async() =>{
    localStorage.getItem("authToken");
    localStorage.getItem("userRole");
    localStorage.getItem("user");

    setAuthToken(null);
    setUserRole(null);
    setUser(null);
};


return(

    <AuthContext.Provider
    value = {{
        authToken,
        user,
        userRole,
        isLoggedIn: !!authToken,
        login,
        logout,        
    }}
    >
            {!loading && children}
    </AuthContext.Provider>

);
};

export const useAuth = () => useContext(AuthContext);
