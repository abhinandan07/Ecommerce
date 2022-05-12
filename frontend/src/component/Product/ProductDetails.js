import React, { Fragment, useEffect } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css";
import { useSelector,useDispatch} from "react-redux"
import { getProductDetails } from '../../actions/productAction';
//import { useParams } from 'react-router-dom';
//import match from 'nodemon/lib/monitor/match';
const ProductDetails = ({match}) => {
    const dispatch= useDispatch();

    const {product,loading,error }=useSelector((state)=>state.productDetails)

    //const {id}=useParams();
        //console.log(id);
    useEffect(() => {
       
        dispatch(getProductDetails(match.params.id))
        //console.log(getProductDetails(id))
         
      
    }, [dispatch,match.params.id])
    
  return (
    <Fragment>
        <div className="ProductDetails"> 
        <div>
            <Carousel>
                {
                    product.images && product.images.map((item, i)=>(
                        <img
                        className="CarouselImage"
                        key={i}
                        src={item.url}
                        alt={`${i} Slide`} 

                        />
                    )
                )}
            </Carousel>
        </div>
        </div>
    </Fragment>
  )
}

export default ProductDetails