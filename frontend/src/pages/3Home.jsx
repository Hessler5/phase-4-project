import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Meme_Card from "../components/Meme_Card";
import Winning_Meme_Card from "../components/Winning_Meme_Card";
import { useUser } from "../UserContext";



function Home() {

    const [usersMeme, setUserMemes] = useState([])
    const {user, setUser} = useUser()
    
    

    useEffect(() => {
        //fetches all memes for the user
        if(user){
            fetch(`/api/memes/${user.id}`).then(resp => resp.json()).then(data => setUserMemes(data))
        }
        
    }, [])

     //handles patching memes
    function handleVote(memeId, captionId) {
        let ballot = {
            "accepting_captions": false,
            "winning_caption": captionId,
        }
        fetch(`/api/meme/${memeId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ballot)
        }).then(resp => resp.json())
        .then(data => {
            console.log(data)
            let newMemeList = usersMeme.map(meme => {
                if(meme.id == memeId){
                    console.log(meme)
                    meme.accepting_captions = false
                    meme.winning_caption = captionId
                }
                return meme
            }
        )      
            setUserMemes(newMemeList)
        })
    }

    //creates meme cards
    const memeCardList = usersMeme.map(meme => {
        if (meme.accepting_captions == false) {
            return <Winning_Meme_Card key = {meme.id} meme = {meme}/>}

        if (meme.accepting_captions == true) {
            return <Meme_Card key = {meme.id} meme = {meme} handleVote = {handleVote}/>}
        })

    //copntrol form for new memes
    //!! Need to updated user idea to be ID of logged in user
    const [newMeme, setNewMeme] = useState({
        "img_url" : "",
        "description" : "",
        "user_id" : user?.id
    })

    function handleNewMemeInputs(e) {
        let key = e.target.id
        let value = e.target.value
        setNewMeme({...newMeme, [key] : value})
    }

    //handles submission of a new meme
    function handleNewMemeSubmission(e) {
        e.preventDefault()

        fetch('/api/meme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMeme)
        }).then(resp => resp.json())
        .then(data => {
            setUserMemes([...usersMeme, data])
        })
        setNewMeme(
            {
            "img_url" : "",
            "description" : "",
            }
        )
    }

    // if (!user) {
    //     <Navigate to='/' />
    // }


    return (
        <div>
            <Header />
            <div className="meme_creator">
                <h1 className="meme_creator_title">Add a Meme!</h1>
                <div className="meme_creator_container">
                    <img id = "img_creator_meme" src = {newMeme.img_url != "" ? newMeme.img_url : "https://i.imgflip.com/3u04h5.jpg?a473832"}/>
                    <form className = "new_meme_submission_form" onSubmit = {handleNewMemeSubmission}>
                        <div className = "entry_field">
                            <label htmlFor="img_url">Meme Image URL</label>
                            <input id="img_url" type="text" onChange = {handleNewMemeInputs} value = {newMeme.img_url}/>
                        </div>
                        <div className = "entry_field">
                            <label htmlFor="description">Meme Description</label>
                            <input id="description" type="text" onChange = {handleNewMemeInputs} value = {newMeme.description}/>
                        </div>
                        <input className = "new_meme_submit" type = "submit" />
                    </form>
                </div>
            </div>
            {memeCardList.reverse()}
        </div>
    );
}

export default Home;
