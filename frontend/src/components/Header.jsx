import React, { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";


function Header(){

    const {user, setUser} = useUser()


    // Will likely have to move logout function to Login or Home
    // Set up handleClickLogout function
    // need to pass down setUser

    function logout() {
        fetch('/api/logout', { method: "DELETE" })
            .then((res) => {
                console.log(res)
                console.log(user)
                if (res.ok) {
                    setUser(null);
                } else {
                    throw new Error("Logout failed");
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    }
    
    

    return(<>
    {user ? (        
    
        <div className="header-div">
            <div className = {"nav_user_info"}>
                <img className={"nav_img"} src = {user.profile_picture}/>
                <h3>User: {user.user_name}</h3>
            </div>
            <h1 id='app-title'>BATTLEMEMES</h1>
            <div className = "div_buttons">
                <NavLink to='/Home'>
                    <button>Home</button>
                </NavLink>        
                <NavLink to='/All_Open_Memes'>
                    <button>Caption Meme</button>
                </NavLink>
                <NavLink to='/All_Finished_Memes'>
                    <button>Complete Memes</button>
                </NavLink>
                <NavLink to='/'>
                    <button onClick={logout}>Logout</button>
                </NavLink>
            </div>
        </div>
        )
        :(<Navigate to='/' />)}
    </>
        

    );
};


export default Header;

