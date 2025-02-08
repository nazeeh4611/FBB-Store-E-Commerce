import React, { useEffect, useState } from 'react';
import { PlusCircle, X, Upload } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { baseurl } from '../../Constant/Base';
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: Category;
  priceINR: number;
  priceAED: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  status?: 'LISTED' | 'UNLISTED';
}

interface Category {
  _id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  priceINR: string;
  priceAED: string;
  images: (File | null)[];
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: '',
    priceINR: '',
    priceAED: '',
    images: [null, null, null, null],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '', '', '']);

  const api = axios.create({
    baseURL: baseurl,
  });

  const getCategories = async () => {
    try {
      const response = await api.get("/admin/get-category");
            if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData(prev => ({ ...prev, images: newImages }));

      const previewUrl = URL.createObjectURL(file);
      const newPreviews = [...imagePreviews];
      newPreviews[index] = previewUrl;
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData(prev => ({ ...prev, images: newImages }));

    const newPreviews = [...imagePreviews];
    newPreviews[index] = '';
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priceINR', formData.priceINR);
      formDataToSend.append('priceAED', formData.priceAED);
      
      formData.images.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`image${index + 1}`, image);
        }
      });

      const response = await api.post("/admin/add-product", formDataToSend);

      if (!response) {
        throw new Error('Failed to create product');
      }

      await getProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      brand: '',
      category: '',
      priceINR: '',
      priceAED: '',
      images: [null, null, null, null],
    });
    setImagePreviews(['', '', '', '']);
  };

  const getProducts = async () => {
    try {
      const response = await api.get("/admin/get-products");
      console.log(response.data.products)

      if (response.data.products && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);


  console.log(products,"this be the products")

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage your products</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Products</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusCircle size={20} />
              <span>Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Product Name</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Brand</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Category</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Price (INR)</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Price (AED)</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Images</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Created At</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
  {products.map((product) => (
    <tr
      key={product._id}
      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
    >
      <td className="py-4 px-4 text-gray-800">{product.name}</td>
      <td className="py-4 px-4 text-gray-800">{product.brand}</td>
      <td className="py-4 px-4 text-gray-800">{product.category.name}</td>
      <td className="py-4 px-4 text-gray-800">₹{product.priceINR}</td>
      <td className="py-4 px-4 text-gray-800">AED {product.priceAED}</td>
      <td className="py-4 px-4">
      <div className="flex space-x-2">
  {product.images && Object.values(product.images).length > 0 && (
    <img 
      src={Object.values(product.images)[0]} 
      alt={`${product.name} 1`}
      className="w-12 h-12 object-cover rounded"
    />
  )}
</div>

      </td>
      <td className="py-4 px-4 text-gray-600">
        {new Date(product.createdAt).toLocaleDateString()}
      </td>
      <td className="py-4 px-4">
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            product.status === 'LISTED'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.status || 'UNLISTED'}
        </span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Add New Product</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (INR)
                      </label>
                      <input
                        type="number"
                        value={formData.priceINR}
                        onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (AED)
                      </label>
                      <input
                        type="number"
                        value={formData.priceAED}
                        onChange={(e) => setFormData({ ...formData, priceAED: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          {imagePreviews[index] ? (
                            <div className="relative w-full h-48">
                              <img
                                src={imagePreviews[index]}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                  <span>Upload Image {index + 1}</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, index)}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG up to 10MB
                              </p>

                              </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-100">
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Creating...' : 'Create Product'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;