import categoryModel from "../Model/CategoryModel.js"
import productModel from "../Model/ProductModel.js"





export const getProduct = async(req,res)=>{
    try {
        const products = await productModel.find().populate('category', 'name')
        .sort({ createdAt: -1 });
        if(products){
            res.status(200).json(products)
        }
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


export const getCategory = async(req,res)=>{
    try {
        const category = await categoryModel.find()
    if(category){
        res.status(200).json(category)
    }
    } catch (error) {
      res.status(500).json({message:"Internal server error"})
    }
}


export const getDetails = async(req,res)=>{
    try {
        const {id} = req.params

        const product = await productModel.findById(id).populate('category', 'name')
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


export const relatedProduct = async(req,res)=>{
    try {
     const categoryId = req.params.category

     const product = await productModel.find({category:categoryId})
     res.status(200).json(product)
     console.log(product)
    } catch (error) {
        
    }
}