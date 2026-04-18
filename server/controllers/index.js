import {
    createCollectorConsumer,
    deleteCollectorConsumer,
    getConsumersByCollector
} from './collectorConsumers.controller.js'

import {
    deleteCollector,
    getAllCollectors,
    getCollectorById,
    getCollectorsByProximity,
    registerCollector,
    updateCollector
} from './collectors.controller.js'

import {
    createCollectorSource,
    deleteCollectorSource,
    getSourcesByCollector
} from './collectorSources.controller.js'

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFilteredProducts,
    getProductById,
    getProductsByFrp,
    getProductsByUser,
    updateProduct,
} from './products.controller.js'

import {
    registerRecycler,
    getAllRecyclers,
    getRecyclerById,
    getFilteredRecyclers
} from './recycler.controller.js'

import {
    createTreatmentProcess,
    deleteTreatmentProcess,
    getAllTreatmentProcesses,
    getTreatmentProcessById,
    getTreatmentProcessesByRecycler,
    updateTreatmentProcess
} from './treatmentProcess.controller.js'

import {
    createTreatment,
    deleteTreatment,
    getAllTreatments,
    getFilteredTreatments,
    getTreatmentById,
    getTreatmentsByRecycler,
    updateTreatment
} from './treatments.controller.js'

import {
    loginUser,
    loginWithGoogle,
    signupWithEmail,
    signupWithGoogle
} from './user.controller.js'

import {
    deleteWaste,
    getAllWasteEntries,
    getFilteredWaste,
    getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser,
    updateWaste,
    uploadWaste
} from './wastes.controller.js'

export {
    createCollectorConsumer,
    createCollectorSource,
    createProduct,
    createTreatment,
    createTreatmentProcess,
    deleteCollector,
    deleteCollectorConsumer,
    deleteCollectorSource,
    deleteProduct,
    deleteTreatment,
    deleteTreatmentProcess,
    deleteWaste,
    getAllCollectors,
    getAllProducts,
    getAllRecyclers,
    getAllTreatmentProcesses,
    getAllTreatments,
    getAllWasteEntries,
    getCollectorById,
    getCollectorsByProximity,
    getConsumersByCollector,
    getFilteredProducts,
    getFilteredRecyclers,
    getFilteredTreatments,
    getFilteredWaste,
    getProductById,
    getProductsByFrp,
    getProductsByUser,
    getRecyclerById,
    getSourcesByCollector,
    getTreatmentById,
    getTreatmentProcessById,
    getTreatmentProcessesByRecycler,
    getTreatmentsByRecycler,
    getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser,
    loginUser,
    loginWithGoogle,
    registerCollector,
    registerRecycler,
    signupWithEmail,
    signupWithGoogle,
    updateCollector,
    updateProduct,
    updateTreatment,
    updateTreatmentProcess,
    updateWaste,
    uploadWaste
}