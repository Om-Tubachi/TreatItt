import { productService } from "../services/products.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(
    async (req, res) => {
        const product = await productService.create(req);
        res
            .status(201)
            .json(new ApiResponse(201, product, 'Product created successfully'));
    }
);

const getAllProducts = asyncHandler(
    async (req, res) => {
        const products = await productService.getAllProducts(req);
        res
            .status(200)
            .json(new ApiResponse(200, products, 'Products retrieved successfully'));
    }
);

const getProductById = asyncHandler(
    async (req, res) => {
        const product = await productService.getProductById(req);
        res
            .status(200)
            .json(new ApiResponse(200, product, 'Product retrieved successfully'));
    }
);

const getProductsByUser = asyncHandler(
    async (req, res) => {
        const products = await productService.getProductsByUser(req);
        res
            .status(200)
            .json(new ApiResponse(200, products, 'User products retrieved successfully'));
    }
);

const getProductsByFrp = asyncHandler(
    async (req, res) => {
        const products = await productService.getProductsByFrp(req);
        res
            .status(200)
            .json(new ApiResponse(200, products, 'FRP products retrieved successfully'));
    }
);

const getFilteredProducts = asyncHandler(
    async (req, res) => {
        const products = await productService.getFilteredProducts(req);
        res
            .status(200)
            .json(new ApiResponse(200, products, 'Filtered products retrieved successfully'));
    }
);

const updateProduct = asyncHandler(
    async (req, res) => {
        const updatedProduct = await productService.updateProduct(req);
        res
            .status(200)
            .json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
    }
);

const deleteProduct = asyncHandler(
    async (req, res) => {
        const result = await productService.deleteProduct(req);
        res
            .status(200)
            .json(new ApiResponse(200, result, 'Product deleted successfully'));
    }
);

export {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFilteredProducts,
    getProductById,
    getProductsByFrp,
    getProductsByUser,
    updateProduct
};

