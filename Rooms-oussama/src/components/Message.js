import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/authContext";
import axios from "axios"


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

    const dateTime = (date1) => {
        const d1 = Date.now();
        const d2 = new Date(date1);
        var diff= Math.abs(d1-d2);
        var date = 0;
        var dateStr = "";
        if (diff >= (1000*3600*24*365)){
            date = diff/(1000 * 3600 * 24 * 365)
            dateStr = Math.floor(date).toString() + " y" 
        } else {
            if(diff >= (1000*3600*24*30)){
                date = diff/(1000*3600*24*30)
                dateStr = Math.floor(date).toString() + " m"
            } else{
                if(diff >= (1000*3600*24)){
                    date = diff/(1000*3600*24)
                    dateStr = Math.floor(date).toString() + " d"
                } else {
                    if(diff >= (1000*3600)){
                        date = diff/(1000*3600)
                        dateStr = Math.floor(date).toString() + " h"
                    } else{
                        if(diff >= (1000*60)){
                            date = diff/(1000*60)
                            dateStr = Math.floor(date).toString() + " min"
                        } else {
                            date = diff/(1000)
                            dateStr = Math.floor(date).toString() + " s"
                        }
                    }
                }
            }
        }
        return dateStr
    }
    const msgs1= msgs.map(x=>{
        return(
       <div className="message-bodyy">
            <button onClick={()=>props.handleChat(x.username)} className="message-body">
                {x.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={x.picture} 
                    />
                    : <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={"http://localhost:5000/images/"+x.picture} 
                    />  
                }
                <div className="message-text">
                    <b className="message-sender">{x.username}</b>
                    <span className="message-content"><small>HAHAHA</small></span>
                </div>
                <h5 className="msg-date">8 min ago</h5>
            </button>
        </div>
        )
    })
    return(
       <>
       {msgs1}
       </>
    )
}