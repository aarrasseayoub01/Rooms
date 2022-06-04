import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/authContext";
import axios from "axios"
import Messagebox from "./Messagebox";


export default function Message(props) {
    const [msgs, setMsgs] = useState([])
    const { user } = useContext(AuthContext);


    // const newAssetArray = await Promise.all(dummyAssets.map(async function(asset) {
    //     const response = await axios.get(currrentPrice(asset.asset_id));
    //     const cp = response.data.market_data.current_price.eur;
    //     const value = Number(cp) * Number(asset.amount);
    //     return { ...asset, value: +value };
    // }));
    // console.log(newAssetArray);
    // setAssets(newAssetArray);


    useEffect( () => {
        const fetchMsgs = async () => {try {
            const msg = await Promise.all(user.following.map(async function(x) {
                const res = await axios.get("http://localhost:5000/api/user/"+x);
                return res.data
            }))
            setMsgs(msg)
            } catch (e) {
                console.log(e);
            }}
        fetchMsgs();
    }, [user])

    const msgs1= msgs.map(x=>{
        return(
            <Messagebox 
                handleChat={props.handleChat}
                username={x.username}
                picture={x.picture}

            />
    //    <div className="message-bodyy">
    //         <button onClick={()=>props.handleChat(x.username)} className="message-body">
    //             {x.picture==="https://i.ibb.co/J25RQCT/profile.png" 
    //                 ? <img 
    //                     width="30px" 
    //                     className="profileimage" 
    //                     alt="chat profile" 
    //                     src={x.picture} 
    //                 />
    //                 : <img 
    //                     width="30px" 
    //                     className="profileimage" 
    //                     alt="chat profile" 
    //                     src={"http://localhost:5000/images/"+x.picture} 
    //                 />  
    //             }
    //             <div className="message-text">
    //                 <b className="message-sender">{x.username}</b>
    //                 <span className="message-content"><small>HAHAHA</small></span>
    //             </div>
    //             <h5 className="msg-date">8 min ago</h5>
    //         </button>
    //     </div>
        )
    })
    return(
       <>
       {msgs1}
       </>
    )
}