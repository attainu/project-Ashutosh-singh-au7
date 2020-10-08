import _ from 'lodash'
import axios from 'axios'
import {loadUser} from './auth'
import history from './../components/history'
import { setAlert } from './alert'


export const addProduct = ({productList, id}) => async dispatch => {
    const config = {
        headers: { 
            'Content-Type': 'application/json'
        }
    }

    let newData = {}

    try{
        productList.map(async product => {
            if (product.checking === 'marked') {
                newData.details = product.detail
                newData.category = product.category     
                newData.price = product.price
                newData.User = id
                let res = await axios.post("/api/v1/products",
                newData,
                config
                )
            }  
        })
        dispatch(loadUser());
        history.push('/app/products')
        dispatch(setAlert('Product Added Successfully', 'success'))
    }catch(err){
        // console.log(err)
    }
}

export const maintainingMark = ({serial, opposite}) => dispatch => {
    try{
        
        dispatch({
            type: "ADD_MARKING",
                payload: {
                    value:opposite ,
                    serial:serial
                }
        })
    }catch(err){
        // console.log(err)
    }
}
 
export const addingProduct = ({serial, detail, value}) => dispatch => {
    try{
        // console.log("From adding product action",serial, detail, value)
        if (detail === 'category'){
            dispatch({
                type: "ADD_CATEGORY",
                payload: {
                    value:value ,
                    serial:serial
                }
            })
        }
        if (detail === 'detail'){
            dispatch({
                type: "ADD_DETAIL",
                payload: {
                    value:value ,
                    serial:serial
                }
            })
        }
        if (detail === 'price'){
            dispatch({
                type: "ADD_PRICE",
                payload: {
                    value:value ,
                    serial:serial
                }
            })
        }
    }catch(err){
        // console.log(err)
    }
}



export const filteringInProduct = ({propProduct, value}) => dispatch => {
    try{
        // console.log("LEt me search in this==>>", propProduct, value)
        let searched =[]
        propProduct.user.products.map(product => { 
             if (product.details.indexOf(value) >= 0)
             {
            //  console.log(product.details.indexOf(value) >= 0)
            searched.push(product)
        }});
        // console.log(searched)
        dispatch({
            type:"PRODUCTS_LOADED",
            payload: {
                products: searched
            }
        })
    }catch(err){
        // console.log(err)
    }
}

export const changeOrder = (products, ordering) => dispatch => {
    try{
        // console.log("from action ",products, ordering)
        let filterProduct
        (ordering === 'desc') ?
         filterProduct = _.orderBy(products, ['price'],['desc'])
        :
         filterProduct = _.orderBy(products, ['price'],['asc'])

        // (ordering === 'asc') ? "desc" : "asc"
        // console.log(filterProduct)
        dispatch({
            type:"PRODUCTS_LOADED",
            payload: {
                products: filterProduct
            }
        })
    }catch(err){
        // console.log(err)
    }
}

export const singleProductDetail = ({id}) => async dispatch => {
    try{
        // console.log("from action", id)
        // console.log(`/api/v1/post/${id.id}`)
        const res = await axios.get(`/api/v1/products/${id}`)
        // console.log(res.data)
        dispatch({
            type:"LOAD_PRODUCT",
            payload: res.data
        })
    }catch(err){
        // console.log(err)
    }
}

export const singleReceiptDetail = ({id}) => async dispatch => {
    try{
        // console.log("from action", id)
        const res = await axios.get(`/api/v1/sell/${id}`)
        // console.log(res.data)
        dispatch({
            type:"LOAD_RECEIPT",
            payload: res.data
        })
    }catch(err){
        // console.log(err)
    }
}

export const updateSingleProductDetail = ({id, detail, category, price}) => async dispatch => {
    try{
        // console.log("from action", {detail, category, price})
        let body = {}
        if(  detail) {
            body.details = detail
        }
        if(  category) {
            body.category = category
        }
        if(  price) {
            body.price = price
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.patch(`/api/v1/products/${id}`,
            body,
            config
        )
        dispatch(loadUser())
        dispatch({
            type:"LOAD_PRODUCT",
            payload: res.data
        }) 
        history.push('/app/products')
        dispatch(setAlert('Product Updated', 'success'))
    }catch(err){
        console.log(err)
    }
}


export const increasingPage = ({sold}) => dispatch => {
    try{
        dispatch({
            type:"NEXT_PAGE",
            payload:{
                sold
            }
        })
    }catch(err){
        console.log(err)
    }
}

export const decreasingPage = ({sold}) => dispatch => {
    try{
        dispatch({
            type:"PREV_PAGE",
            payload:{
                sold
            }
        })
    }catch(err){
        console.log(err)
    }
}

export const calculations = ({sold, data}) => dispatch => {
    try{

        let { filterDate, swiggy, zomato, foodpanda, store } = data

    let date = filterDate

    let d = new Date().toLocaleString()

    let soldData = []

    sold.map(s => {
        if (s.date){
            let date2 = s.date.split(" ")
            if (d.split(" ")[0] === date2[0]){
                soldData.push(s)
            }
        }
    })


    var grouped = _.groupBy(soldData, function(s) {
        return s.revenue;
    });
      
      
    foodpanda =   _.sumBy(grouped.Foodpanda, x => x.total)
    swiggy =   _.sumBy(grouped.Swiggy, x => x.total)
    zomato =   _.sumBy(grouped.Zomato, x => x.total)
    store =   _.sumBy(grouped.Store, x => x.total)
    dispatch({
        type:"UPDATE_TODAYSALES",
        payload:{
            foodpanda,swiggy,zomato,store
        }
    })
       
    }catch(err){
        console.log(err)
    }
}