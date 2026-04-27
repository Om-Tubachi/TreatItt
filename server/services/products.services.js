import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const userId = req?.user?.id;
        const { frpId, description, date } = req.body;

        if ([userId, frpId].some(f => !f))
            throw new ApiError(400, "Missing required fields");

        const results = await this.prisma.$queryRaw`
        select exists (select 1 from frp where id = ${frpId}::uuid) as frp_exists
        `
        const { frp_exists } = results[0]

        if (!frp_exists)
            throw new ApiError(409, "invalid input for frp")

        const product = await this.prisma.products.create({
            data: {
                u_id: userId,
                frp_id: frpId,
                description,
                date
            }
        })

        if (!product)
            throw new ApiError(500, "Something went wrong while creating product");

        return product;
    }

    async getAllProducts(req) {
        const products = await this.prisma.products.findMany()

        if (!products.length)
            throw new ApiError(500, "Something went wrong while fetching products");

        return products;
    }

    async getProductById(req) {
        const { productId } = req.params;

        if (!productId)
            throw new ApiError(400, "Product ID is required");

        const product = await this.prisma.products.findUnique({
            where: { id: productId }
        })

        if (!product)
            throw new ApiError(404, "Product does not exist");

        return product;
    }

    async getProductsByUser(req) {
        const { userId } = req.params;

        if (!userId)
            throw new ApiError(400, "User ID is required");

        const products = await this.prisma.products.findMany({
            where: { u_id: userId }
        })

        if (!products.length)
            throw new ApiError(500, "Something went wrong while fetching products");

        return products;
    }

    async getProductsByFrp(req) {
        const { frpId } = req.params;

        if (!frpId)
            throw new ApiError(400, "FRP ID is required");

        const products = await this.prisma.products.findMany({
            where: { frp_id: frpId }
        })

        if (!products.length)
            throw new ApiError(500, "Something went wrong while fetching products");

        return products;
    }

    async getFilteredProducts(req) {
        const { compositionId, frp } = req.query;

        if (!compositionId && !frp)
            throw new ApiError(400, "At least one filter is required");

        const products = await this.prisma.products.findMany({
            where: {
                OR: [
                    ...(frp ? [{ frp_id: frp }] : []),
                    ...(compositionId ? [{ frp: { composition_id: compositionId } }] : [])
                ]
            }
        });

        if (!products.length)
            throw new ApiError(210, "No products found matching the provided filters");

        return products;
    }

    async updateProduct(req) {
        const { productId } = req.params;
        const updateData = req.body;

        if (!productId)
            throw new ApiError(400, "Product ID is required");

        if (!Object.keys(updateData).length)
            throw new ApiError(400, "No update data provided");

        const updatedProduct = await this.prisma.products.update({
            where: { id: productId },
            data: {
                ...(updateData.frpId && { frp_id: updateData.frpId }),
                ...(updateData.description && { description: updateData.description }),
                ...(updateData.date && { date: updateData.date }),
                updatedat: new Date()
            }
        })

        if (!updatedProduct)
            throw new ApiError(500, "Something went wrong while updating product");

        return updatedProduct;
    }

    async deleteProduct(req) {
        const { productId } = req.params;

        if (!productId)
            throw new ApiError(400, "Product ID is required");

        await this.prisma.products.delete({
            where: { id: productId }
        });

        return { success: true, message: "Product deleted" };
    }
}

export const productService = new ProductService(prisma);