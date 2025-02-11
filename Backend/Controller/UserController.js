import categoryModel from "../Model/CategoryModel.js"
import productModel from "../Model/ProductModel.js"
import subcategoryModel from "../Model/SubCategoryModel.js";





export const getProduct = async(req,res)=>{
    try {
        const products = await productModel.find().populate('productTypeId', 'name')
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
export const getSubCategories = async(req,res)=>{
    try {
        const id = req.params.id
        console.log(id,"may")
        const category = await subcategoryModel.find({categoryId:id})
        console.log(category,"after")
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

        const product = await productModel.findById(id).populate('subCategoryId', 'name')
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


export const getSubCategory = async(req,res)=>{
    try {
        const {id} = req.params

        const subcategory = await subcategoryModel.find({categoryId:id})
        if(!subcategory){
            res.status(404).json({message:"subcategory not found"})
        }
        res.status(200).json(subcategory)
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


export const ProductType = async(req,res)=>{
    try {
        const {id} = req.params

        const type = await ProductTypeModel.find({subCategoryId:id})
        if(!type){
            res.status(404).json({message:"subcategory not found"})
        }
        res.status(200).json(type)
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

export const relatedProduct = async(req,res)=>{
    try {
     const categoryId = req.params.category

     const product = await productModel.find({subCategoryId:categoryId})
     res.status(200).json(product)
    } catch (error) {
        
    }
}