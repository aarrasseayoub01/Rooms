import React, { useContext } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthContext } from "./Context/authContext";
import OtherProfile from "./components/OtherProfile"
import Searching from "./components/Searching"
import PostPage from "./components/PostPage"
import Room from "./components/Room"
import AddRoom from "./components/AddRoom"
import RoomPostPage from "./components/RoomPostPage.js"
import SavedPosts from "./components/SavedPosts"


export default function App() {
  const {user} = useContext(AuthContext); //Prendre l'utilisateur connecte depuis le "Context"
  
  //Rediriger vers le profile si le "id" est egale a celui de l'utilisateur
  function HandleProfile() {
    let { id } = useParams();
    return (
      id === user._id 
        ? <Profile />
        : <OtherProfile userId={id} /> 
    )
  }
  //Afficher la page de recherche
  function HandleSearch() {
    let { id } = useParams();
    return (
      <Searching userId={id} /> 
    )
  }

  function HandlePost() {
    let { id } = useParams();
    return(
      <PostPage id={id} />
    )
  }
  function HandleRoomPost() {
    let { id } = useParams();
    let { id2 } = useParams();
    return(
      <RoomPostPage id={id} roomId={id2} />
    )
  }
  function HandleRoom() {
    let { id } = useParams();
    return(
      <Room id={id} />
    )
  }

    return(
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
          <Route path="/login" element={user ? <Feed /> : <Login />} />
          <Route path="/register" element={user ? <Feed /> : <Register />} />
          <Route path="/" element={user ? <Feed /> : <Login />} />
          <Route path="/profile" element={user ? <Profile /> : <Login />} />
          <Route path="/:id" element={user 
              ? <HandleProfile />
              : <Login />} />
          <Route path="/search/:id" element={user 
              ? <HandleSearch />
              : <Login />} />
          <Route path="/posts/:id" element={user
              ? <HandlePost />
              : <Login />} />
          <Route path="/roompost/:id/:id2" element={user
              ? <HandleRoomPost />
              : <Login />} />
          <Route path="/room/:id" element={user
              ? <HandleRoom />
              : <Login />} />
          <Route path="/newroom" element={user
              ? <AddRoom />
              : <Login />} />
          <Route path="/savedposts" element={user
              ? <SavedPosts />
              : <Login />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
        
    )
}
