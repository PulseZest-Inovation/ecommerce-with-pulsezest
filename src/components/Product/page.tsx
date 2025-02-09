"use client";
import React, { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Tabs,  Button, message, Tooltip, Affix, } from "antd";
import { useRouter } from "next/navigation";
import { Product } from "@/types/Product";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import ProductDetailTab from "./ProductDetailTab/page";
import ProdutOtherTab from "./ProductOtherTab/page";
import ProductGalleryTab from "./ProductGalleryTab/page";
import { Fab } from '@mui/material';
import { getAppData } from "@/services/getApp";
import { AppDataType } from "@/types/AppData";

interface ProductWrapperProps {
  initialData?: Product;
}

const ProductWrapper: React.FC<ProductWrapperProps> = ({ initialData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Product>({
    id: "",
    productTitle: "",
    productSubtitle: "",
    slug: "",
    permalink: "",
    type: "simple",
    status: "draft",
    featured: false,
    catalog_visibility: "visible",
    shortDescription: "",
    sku: "",
    price: "",
    regularPrice: "",
    salePrice: "",
    gstRate: "",
    guides: [],
    // Dimessions and weight;
    height:0,
    length: 0,
    breadth: 0,
    weight:0,


    isReadyToWear: false,
    readyToWearCharges: 0,

    isPrePlated: false,
    prePlatedCharges: 0,

    // these
    isReturn: true,
    returnPeriod: "Hassle-free 10 days return & exchange",
    isShippingCharge: false, //done
    deliveryTimePeriod: '2-7 days delivery with in India', //done
    isCashOnDelivery: true, //done
    //these

    HSN: "",
    createdAt: Timestamp.now(),
    ModifiedAt: Timestamp.now(),
    dateOnSaleTo: null,
    dateOnSaleFrom: null,
    price_html: "",
    onSale: false,
    purchaseSale: false,
    totalSales: 0,
    manageStatus: false,
    stockQuantity: 0,
    stockStatus: "in-stock",
    backorders: false,
    backordersAllowed: false,
    shipping_taxable: "",
    reviewsAllowed: true,
    averageRating: "0",
    ratingCount: 0,
    categories: [],
    tags: [],
    featuredImage: "",
    galleryImages: [],
    videoUrl: "",
    variation: [],
    attributes: [],
    menuOrder: 0,
    metaData: [],
    description: [
      { heading: "Details", content: "" },
      { heading: "Description ", content: "" },
      { heading: "Shipping", content: "" },
      { heading: "Return & Exchange", content: "" },
      { heading: "Manufacturing Information ", content: "" },
      { heading: "Support", content: "" },
    ],
  });
  const [appData, setAppData]= useState<null| AppDataType>(null);

  const fetchApplicationData = async()=>{
    try {
      const data = await getAppData<AppDataType>();
      setAppData(data);
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        createdAt: initialData.createdAt || Timestamp.now(),
        ModifiedAt: initialData.ModifiedAt || Timestamp.now(),
        description: Array.isArray(initialData.description)
          ? initialData.description
          : prev.description,
      }));
      fetchApplicationData();
    }
  }, [initialData]);

  const router = useRouter();

  const handleInputChange = (key: keyof Product, value: any) => {
    if (key === "productTitle" && !initialData) {
      const slug = generateSlug(value);
      setFormData((prev) => ({ ...prev, [key]: value, slug }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (!formData.productTitle && !formData.categories[0]) {
      message.error("Product Title and categories is required!");
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    let currentSlug = formData.slug;

    if (!initialData) {
      // Only check for slug availability for new products
      const existingSlug = await checkSlugAvailability(currentSlug);
      if (existingSlug) {
        currentSlug = `${currentSlug}-${Date.now()}`;
      }
    }

    try {
      await setDocWithCustomId("products", currentSlug, {
        ...formData,
        slug: currentSlug, // Preserve the existing slug if editing
        id: currentSlug,
      });

      //saving the sku
      if (formData.sku) {
        await setDocWithCustomId("sku", formData.sku, {
          skuCode: formData.sku,
        });
      }

      message.success(
        initialData
          ? "Product Updated Successfully!"
          : "Product Added Successfully!"
      );

      router.push("/dashboard/manage-product/view-all-product");
    } catch (error) {
      message.error("Error adding/updating product.");
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async (slug: string): Promise<string> => {
    try {
      const products = await getAllDocsFromCollection<Product>("products");
      const existingProduct = products.find((product) => product.slug === slug);
      return existingProduct ? existingProduct.slug : "";
    } catch (error) {
      console.error("Error checking slug availability:", error);
      throw new Error("Failed to verify slug availability.");
    }
  };

  const items = [
    {
      label: "Product Details",
      key: "1",
      children: (
        <ProductDetailTab
          formData={formData}
          onFormDataChange={handleInputChange}
        />
      ),
    },
    {
      label: "Other Fields",
      key: "2",
      children: (
        <ProdutOtherTab
          formData={formData}
          onFormDataChange={handleInputChange}
        />
      ),
    },
    {
      label: "Product Gallery",
      key: "3",
      children: (
        <ProductGalleryTab
          formData={formData}
          onFormDataChange={handleInputChange}
          slug={formData.slug}
        />
      ), // Component for Tab 3
    },
  ];

  const operations =  (
    
    <div className="flex justify-center sm:justify-end p-2">
      <Tooltip
        title={
          !formData.productTitle || !formData.categories[0]
            ? "Please fill in the Product Title and select at least one category."
            : ""
        }
      >
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.productTitle || !formData.categories[0]}
          loading={loading}
          className="w-full sm:w-auto"
        >
          Submit
        </Button>
      </Tooltip>
    </div>
  );
  

  const handleCopySlug = () => {
    navigator.clipboard.writeText(formData.slug);
    message.success("Slug copied to clipboard!");
  };

  const handleNavigate = () => {
    const url = `${appData?.callback_url}/collection/${formData.categories[0]}/product/${formData.slug}`;
    window.open(url, '_blank');
  };

  const [showOperations, setShowOperations] = useState(false);

 
  
  return (
    <div>
    {/* Slug and Link Section */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
      <p
        className="text-blue-300 font-mono cursor-pointer break-all"
        onClick={handleCopySlug}
      >
        {/* Display the slug here */}
        {formData.slug}
      </p>
    </div>

    {/* Tabs Section */}
    <div className="mt-4">
      <div className="overflow-x-auto">
        <Tabs
          centered
          tabBarExtraContent={{
            left: (
              <div className="hidden sm:block">
                {operations}
              </div>
            ),
            right: (
              <LinkOutlined
                onClick={handleNavigate}
                className="cursor-pointer text-blue-500 text-lg"
              />
            ),
          }}
          items={items}
          type="card"
          animated
          className="custom-tabs"
          tabBarStyle={{
            whiteSpace: 'nowrap',
            overflowX: 'auto', // Enables horizontal scrolling if necessary
            paddingRight: '0px', // Remove padding to prevent shifting
            display: 'inline-flex', // Ensures that the tab bar can scroll horizontally if the space is constrained
          }}
        />
      </div>
    </div>

    {/* Floating Action Button for Mobile */}
    <div className="fixed bottom-4 right-4 sm:hidden">
      <Fab
        onClick={() => setShowOperations(!showOperations)} // Toggle the operations visibility
        className="bg-blue-500 text-white"
      >
        <span className="text-xl">+</span>
      </Fab>
      {showOperations && (
        <div className="absolute bottom-16 right-4 bg-white p-4 rounded-lg shadow-lg">
          {operations}
        </div>
      )}
    </div>
  </div>
  
  
  );
};

export default ProductWrapper;
