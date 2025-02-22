import React, { Fragment, useEffect, useState } from 'react'
  
import { useDispatch,useSelector } from 'react-redux'; 
import { getProductDetails,   newReview,  clearErrors } from '../../allActions/productAction';
import {useParams } from "react-router-dom"; 
import "./SingleProduct.css"; 
import RCard from "./RCard.js"; 
import Wait from "../layout/Waiting/Wait.js";
import { addItemsToCart } from "../../allActions/cartAction.js";
import Swal  from "sweetalert2";
import { 
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, 
    Button,
  } from "@mui/material";
import { Rating } from "@mui/lab";
import { NEW_REVIEW_RESET } from "../../Steady/productSteady";


const SingleProduct = () => {  
    const dispatch=useDispatch();
    const {product, loading, error } =useSelector((state)=> state.productDetails);

    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
      );

    const options = {  
        size: "large",
        value: product.ratings,
        readOnly: true, 
        precision: 0.5,
      };

      
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(""); 
  


      const increaseQuantity = () => {
        if (product.Stock <= quantity) return;
    
        const qty = quantity + 1;
        setQuantity(qty);
      };
    
      const decreaseQuantity = () => {
        if (1 >= quantity) return;
    
        const qty = quantity - 1;
        setQuantity(qty);
      };
      const {id} =useParams(); 
 
      const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        Swal.fire({
          text: 'Added to Cart'
        }) 
     };
       
      const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
      };

      const reviewSubmitHandler = () => {
        const myForm = new FormData();
    
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId",id);
     
        dispatch(newReview(myForm));
    
        setOpen(false);
      };
 
     useEffect(()=>{

        if (error) {
          Swal.fire({
            text: 'error occur'
                }) 
            dispatch(clearErrors());
          }

        if (reviewError) {
          Swal.fire({
            text: 'review error'
                }) 
           dispatch(clearErrors());
          }

          if (success) {
            Swal.fire({
              text: 'Review Submitted Successfully'
                  }) 
            dispatch({ type: NEW_REVIEW_RESET });
          } 

        dispatch(getProductDetails(id));
    },[dispatch, id, error, reviewError, success]);
 
  return (
    <Fragment>
        {loading ? ( <Wait/> ) : 
        (
         <Fragment>  
             
         <div className="SingleProduct">
            <div>
            
               { product.image && product.image.map((item,i)=>(
                    <img 
                    className="Image"
                    key={item.url}
                    src={item.url}
                    alt={`${i}Slide`}
                    />
                )) 
               } 
           
            </div>  

        <div>
            <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
            </div> 
            <div className="detailsBlock-2">
                <Rating {...options}/>
                <span className="detailsBlock-2-span">
                    {" "}
                    ({product.numOfReviews} Reviews)
                </span>
            </div>
            <div className="detailsBlock-3">
                <h1>{`₹ ${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button
                    disabled={product.Stock < 1 ? true : false }
                    onClick={addToCartHandler}>
                        Add to Cart
                    </button>
                </div>

                <p>
                    Status:
                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                    </b>
                </p>
            </div> 

            <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
            </div>

            <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
            </button>
        </div>
    </div>
 
    <h3 className="reviewsHeading">REVIEWS</h3>

    <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating} 
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
   {product.reviews && product.reviews[0] ? (
    <div className="reviews">
        {product.reviews &&
         product.reviews.map((review)=>(
            <RCard key={review._id} review={review}></RCard>
         ))}
    </div>
   ) : (
    <p className="noReviews">No Reviews Yet</p> 
   )}

    </Fragment> 
        )}
    </Fragment>
  );
};

export default SingleProduct;