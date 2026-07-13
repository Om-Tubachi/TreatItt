import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { lookupSyncService } from './lookupSync.service.js';

class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(req) {
        const userId = req?.user?.id;
        const {
            frpId,
            description,
            date,
            quantity,
            price,
            latitude,
            longitude,
            formTemplateId,
            metrics
        } = req.body;

        if ([userId, frpId].some(f => !f))
            throw new ApiError(400, "Missing required fields");

        const results = await this.prisma.$queryRaw`
        select exists (select 1 from frp where id = ${frpId}::uuid) as frp_exists
        `
        const { frp_exists } = results[0]
        console.log('frp_exists:', frp_exists)
        if (!frp_exists)
            throw new ApiError(409, "invalid input for frp")

        if (formTemplateId) {
            const templateCheck = await this.prisma.$queryRaw`
                select exists (select 1 from form_templates where id = ${formTemplateId}::uuid) as template_exists
            `
            if (!templateCheck[0].template_exists)
                throw new ApiError(409, "invalid input for form template")
        }

        const product = await this.prisma.products.create({
            data: {
                users: { connect: { id: userId } },
                frp: { connect: { id: frpId } },
                description,
                date,
                quantity: quantity ?? null,
                price: price ?? null,
                latitude: latitude ?? null,
                longitude: longitude ?? null,
                ...(formTemplateId && { form_templates: { connect: { id: formTemplateId } } }),
                metrics: metrics ?? {}
            }
        })

        if (!product)
            throw new ApiError(500, "Something went wrong while creating product");
        await lookupSyncService.syncLookupEntry('product', product.id)
        return product;
    }

    async getAllProducts(req) {
        const products = await this.prisma.products.findMany({
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                form_templates: true,
                users: { select: { id: true, username: true } }
            }
        })

        if (!products.length)
            throw new ApiError(500, "Something went wrong while fetching products");

        return products;
    }

    async getProductById(req) {
        const { productId } = req.params;

        if (!productId)
            throw new ApiError(400, "Product ID is required");

        const product = await this.prisma.products.findUnique({
            where: { id: productId },
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                form_templates: true,
                users: { select: { id: true, username: true, first_name: true, last_name: true, company_name: true } }
            }
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
            where: { u_id: userId },
            include: {
                frp: {
                    include: {
                        composition: true,
                        category: true,
                        grade: true,
                        resin: true
                    }
                },
                form_templates: true,
                users: { select: { id: true, username: true } }
            }
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
            where: { frp_id: frpId },
            include: {
                users: { select: { id: true, username: true } }
            }
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
            },
            include: {
                users: { select: { id: true, username: true } }
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

        if (updateData.formTemplateId) {
            const templateCheck = await this.prisma.$queryRaw`
            select exists (select 1 from form_templates where id = ${updateData.formTemplateId}::uuid) as template_exists
        `
            if (!templateCheck[0].template_exists)
                throw new ApiError(409, "invalid input for form template")
        }

        const updatedProduct = await this.prisma.products.update({
            where: { id: productId },
            data: {
                ...(updateData.frpId && { frp: { connect: { id: updateData.frpId } } }),
                ...(updateData.description && { description: updateData.description }),
                ...(updateData.date && { date: updateData.date }),
                ...(updateData.quantity && { quantity: parseFloat(updateData.quantity) }),
                ...(updateData.price && { price: parseFloat(updateData.price) }),
                ...(updateData.latitude && { latitude: updateData.latitude }),
                ...(updateData.longitude && { longitude: updateData.longitude }),
                ...(updateData.formTemplateId !== undefined && {
                    form_templates: updateData.formTemplateId
                        ? { connect: { id: updateData.formTemplateId } }
                        : { disconnect: true }
                }),
                ...(updateData.metrics !== undefined && { metrics: updateData.metrics }),
                updatedat: new Date()
            }
        })

        if (!updatedProduct)
            throw new ApiError(500, "Something went wrong while updating product");
        await lookupSyncService.syncLookupEntry('product', productId)
        return updatedProduct;
    }

    async deleteProduct(req) {
        const { productId } = req.params;

        if (!productId)
            throw new ApiError(400, "Product ID is required");

        await this.prisma.products.delete({
            where: { id: productId }
        });
        await lookupSyncService.deleteLookupEntry('product', productId)
        return { success: true, message: "Product deleted" };
    }
}

export const productService = new ProductService(prisma);