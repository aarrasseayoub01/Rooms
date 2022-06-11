import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/authContext";

export default function MiniSearchedUser(props) {
    const {user} = useContext(AuthContext)
    // const [users, setUsers] = useState([]);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //     const res = await axios.get("http://localhost:5000/api/user/allusers");
    //     setUsers(
    //         res.data.sort((p1, p2) => {
    //           return new Date(p2.createdAt) - new Date(p1.createdAt);
    //         })
    //     );
    //     };
    //     fetchUsers();
    // }, []);

    
    function checkFriendship(id, List1, List2){
        if(List1.includes(id)){
            if(List2.includes(id)){
                return "Friend"
            } else {
                return "Followed"
            }
        } else {
            if(List2.includes(id)){
                return "Follower"
            } else {
                return "Not friend"
            }
        }
    }
    //Affiche les utlisateurs trouve avec le meme nom recherche
    return(
        <div >
            <div className="minisearched-user">
                <Link to={"../"+props.id}>
                {props.image==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img className="searchimage" src={props.image} alt="User Profile" />
                    : <img className="searchimage" src={"http://localhost:5000/images/" + props.image} alt="User Profile" />
                }</Link>
                <div className="user-propreties">
                    <Link to={"../"+props.id} className="link-username"><b className="searched-username">{props.username}</b></Link>
                    <p>{(user._id===props.id 
                        ? "Your profile"
                        : checkFriendship(props.id, user.following, user.followers)
                        )}</p>
                    <small>23 mutual friends</small>
                </div>
            </div>
        </div>
    )
}