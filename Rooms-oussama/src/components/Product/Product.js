import React, { useRef, useContext, useState, useEffect } from "react";
import './Product.css'
import {useNavigate} from "react-router-dom"

import axios from 'axios';


export default function Product(props) {
    const navigate = useNavigate();


    const handleOrg = (e) => {
        navigate("/product/"+props.prod._id);
    }
    const handleEdit = async() => {
        navigate("/product/"+props.prod._id);
    }
    const handleDelete= async (e)=>{
        e.preventDefault();
        try{
            await axios.delete("http://localhost:5000/api/product/" + props.prod._id);
            navigate("../../main")
        }catch(err){
            console.log(err)      
        }
    }

    return(
        // <tr onClick={handleOrg} className="sortable">
        //     <td>{props.prod.name}</td>
        //     <td><img src={"../../../../../Server/public/images/"+props.prod.photos}/></td>
        //     <td>{props.prod.creation_date}</td>
        // </tr>
        <div class="col-md-3">

        <div class="card p-3">

            <div onClick={handleOrg}  class="text-center">

                <img src={"http://localhost:5000/images/"+props.prod.photos} width="200"/>
                
            </div>

            <div class="product-details">


                 <span onClick={handleOrg} >{props.prod.name}</span>


                 <div class="buttons d-flex flex-row">
                    <div class="cart"><i class="fa fa-shopping-cart"></i></div> <button onClick={handleEdit} class="btn btn-success cart-button btn-block mx-3"><span class="dot">1</span>Modifier </button>
                    <button onClick={handleDelete} class="btn btn-danger cart-button btn-block"><span class="dot">1</span>Supprimer </button>
                </div>

                 <div class="weight">

                    <small>1 piece 2.5kg</small>
                                                 
                 </div>

            </div>


            
        </div>
        

    </div>
    )
}