import  { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { baseurl } from '../../Constant/Base';
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory extends Category {
  categoryId: Category;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  categoryId: Category;
  subCategoryId: SubCategory;
  priceINR: number;
  priceAED: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  trending: boolean;
  seller:seller
}

interface seller{
  name:string
}



const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const api = axios.create({
    baseURL: baseurl,
  });

  // const getCategories = async () => {
  //   try {
  //     const response = await api.get("/admin/get-category");
  //     if (response.data && Array.isArray(response.data)) {
  //       setCategories(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //   }
  // };

  // const getSubCategories = async () => {
  //   try {
  //     const response = await api.get("/admin/get-subcategory");
  //     if (response.data && Array.isArray(response.data)) {
  //       setSubCategories(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching subcategories:', error);
  //   }
  // };

  const getProducts = async () => {
    try {
      const response = await api.get("/admin/get-products");
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const categoryId = e.target.value;
  //   setFormData({
  //     ...formData,
  //     categoryId,
  //     subCategoryId: '',
  //   });
    
  //   const filtered = subCategories.filter(
  //     (subCat) => subCat.categoryId._id === categoryId
  //   );
  //   setFilteredSubCategories(filtered);
  // };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const newImages = [...formData.images];
  //     newImages[index] = file;
      
  //     const newExistingImages = [...formData.existingImages];
  //     newExistingImages[index] = '';
      
  //     const previewUrl = URL.createObjectURL(file);
  //     const newPreviews = [...imagePreviews];
  //     newPreviews[index] = previewUrl;
      
  //     setFormData(prev => ({
  //       ...prev,
  //       images: newImages,
  //       existingImages: newExistingImages
  //     }));
  //     setImagePreviews(newPreviews);
  //   }
  // };

  // const removeImage = (index: number) => {
  //   const newImages = [...formData.images];
  //   newImages[index] = null;
    
  //   const newExistingImages = [...formData.existingImages];
  //   newExistingImages[index] = '';
    
  //   const newPreviews = [...imagePreviews];
  //   newPreviews[index] = '';
    
  //   setFormData(prev => ({
  //     ...prev,
  //     images: newImages,
  //     existingImages: newExistingImages
  //   }));
  //   setImagePreviews(newPreviews);
  // };

  const handleTrendingToggle = async (productId: string, currentValue: boolean) => {
    try {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, trending: !currentValue }
            : product
        )
      );

      const response = await api.put(`/admin/update-trending/${productId}`, {
        isTrending: !currentValue
      });

      if (!response.data) {
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, trending: currentValue }
              : product
          )
        );
      }
    } catch (error) {
      console.error('Error updating trending status:', error);
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, trending: currentValue }
            : product
        )
      );
    }
  };



  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('name', formData.name);
  //     formDataToSend.append('brand', formData.brand);
  //     formDataToSend.append('categoryId', formData.categoryId);
  //     formDataToSend.append('subCategoryId', formData.subCategoryId);
  //     formDataToSend.append('priceINR', formData.priceINR);
  //     formDataToSend.append('priceAED', formData.priceAED);
  //     formDataToSend.append('isTrending', formData.isTrending.toString());
      
  //     const nonEmptyExistingImages = formData.existingImages.filter(url => url !== '');
  //     formDataToSend.append('existingImages', JSON.stringify(nonEmptyExistingImages));
      
  //     formData.images.forEach((image, index) => {
  //       if (image) {
  //         formDataToSend.append(`image${index + 1}`, image);
  //       }
  //     });
      
  //     if (editingProduct) {
  //       await api.put(`/admin/edit-product/${editingProduct}`, formDataToSend);
  //     } else {
  //       await api.post("/admin/add-product", formDataToSend);
  //     }
      
  //     await getProducts();
  //     handleCloseModal();
  //   } catch (error) {
  //     console.error('Error saving product:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  //   setEditingProduct(null);
  //   setFormData({
  //     name: '',
  //     brand: '',
  //     categoryId: '',
  //     subCategoryId: '',
  //     priceINR: '',
  //     priceAED: '',
  //     images: [null, null, null, null],
  //     existingImages: [],
  //     isTrending: false
  //   });
  //   setImagePreviews(['', '', '', '']);
  //   setFilteredSubCategories([]);
  // };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'seller':
        aValue = a.seller;
        bValue = b.seller;
        break;
      case 'brand':
        aValue = a.brand;
        bValue = b.brand;
        break;
      case 'category':
        aValue = a.categoryId.name;
        bValue = b.categoryId.name;
        break;
      case 'priceINR':
        aValue = a.priceINR;
        bValue = b.priceINR;
        break;
      case 'priceAED':
        aValue = a.priceAED;
        bValue = b.priceAED;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc' 
        ? (aValue > bValue ? 1 : -1) 
        : (aValue < bValue ? 1 : -1);
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const SortIndicator = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  useEffect(() => {
    getProducts();
    // getCategories();
    // getSubCategories();
  }, []);

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
          <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Products</h2>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
             
            </div>
          </div>
  
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th 
                    className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Product Name <SortIndicator field="name" />
                  </th>
                  <th 
                    className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort('seller')}
                  >
                    Seller <SortIndicator field="seller" />
                  </th>
                  <th 
                    className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort('brand')}
                  >
                    Brand <SortIndicator field="brand" />
                  </th>
                  <th 
                    className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    Category <SortIndicator field="category" />
                  </th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">
                    Sub Category
                  </th>
                  <th 
                    className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort('priceINR')}
                  >
                    Price (INR) <SortIndicator field="priceINR" />
                  </th>
                  <th 
                    className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort('priceAED')}
                  >
                    Price (AED) <SortIndicator field="priceAED" />
                  </th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Images</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Trending</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-800">{product.name}</td>
                      <td className="py-4 px-4 text-gray-800">{product.seller.name}</td>
                      <td className="py-4 px-4 text-gray-800">{product.brand}</td>
                      <td className="py-4 px-4 text-gray-800">{product.categoryId.name}</td>
                      <td className="py-4 px-4 text-gray-800">{product.subCategoryId.name}</td>
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
                      <td className="py-4 px-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.trending}
                            onChange={() => handleTrendingToggle(product._id, product.trending)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                      <td className="py-4 px-4">
                        
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-4 px-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {sortedProducts.length > 0 && totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedProducts.length)} of {sortedProducts.length} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {totalPages <= 5 ? (
                  // If we have 5 or fewer pages, show all of them
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))
                ) : (
                  // If we have more than 5 pages, show a limited set with ellipsis
                  <>
                    {/* Always show first page */}
                    <button
                      onClick={() => paginate(1)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      1
                    </button>
                    
                    {/* Show ellipsis if current page is > 3 */}
                    {currentPage > 3 && (
                      <span className="w-10 h-10 flex items-center justify-center">...</span>
                    )}
                    
                    {/* Show current page and neighbors */}
                    {Array.from(
                      { length: 3 },
                      (_, i) => currentPage - 1 + i
                    )
                      .filter(num => num > 1 && num < totalPages)
                      .map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === number
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    
                    {/* Show ellipsis if current page is < totalPages - 2 */}
                    {currentPage < totalPages - 2 && (
                      <span className="w-10 h-10 flex items-center justify-center">...</span>
                    )}
                    
                    {/* Always show last page */}
                    <button
                      onClick={() => paginate(totalPages)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
  
  
      </main>
    </div>
  );
};

export default ProductPage;