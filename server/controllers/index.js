import {
    loginUser,
    loginWithGoogle,
    signupWithEmail,
    signupWithGoogle
} from '../controllers/user.controller.js'

import {
    deleteWaste,
    getAllWasteEntries,
    getFilteredWaste,
    getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser,
    updateWaste,
    uploadWaste
} from '../controllers/wastes.controller.js'

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFilteredProducts,
    getProductById,
    getProductsByFrp,
    getProductsByUser,
    updateProduct,
} from '../controllers/products.controller.js'


export {
    createProduct,
    deleteProduct, deleteWaste, getAllProducts, getAllWasteEntries, getFilteredProducts, getFilteredWaste, getProductById,
    getProductsByFrp,
    getProductsByUser, getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser, loginUser,
    loginWithGoogle, signupWithEmail, signupWithGoogle, updateProduct, updateWaste,
    uploadWaste
}

