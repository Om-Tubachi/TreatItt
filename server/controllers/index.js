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


export {
    deleteWaste,
    getAllWasteEntries,
    getFilteredWaste,
    getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser, loginUser,
    loginWithGoogle, signupWithEmail, signupWithGoogle, updateWaste,
    uploadWaste
}
