import {
    createCollectorConsumer,
    deleteCollectorConsumer,
    getConsumersByCollector
} from './collectorConsumers.controller.js'

import { getFrp } from './frp.controller.js'
import {
    createManufacturingProcess,
    deleteManufacturingProcess,
    getManufacturingProcessById,
    getManufacturingProcessesByUser,
    getSystemDefaults,
    updateManufacturingProcess
} from './manufacturingProcess.controller.js'
import { getAllTreatmentMethods } from './treatmentMethod.controller.js'

import {
    createRecycleProcess,
    deleteRecycleProcess,
    getAllRecycleProcesses,
    getFilteredRecycleProcesses,
    getRecycleProcessById,
    getRecycleProcessesByRecycler,
    updateRecycleProcess
} from './recycleProcess.controller.js'

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
    getAllRecyclers,
    getFilteredRecyclers,
    getRecyclerById,
    registerRecycler
} from './recycler.controller.js'



import {
    getUserById,
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

import {
    createTreatmentProcess,
    deleteTreatmentProcess, getAllTreatmentProcesses,
    getTreatmentProcessById,
    getTreatmentProcessesByRecycler,
    updateTreatmentProcess,
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
    createRequirement,
    deleteRequirement,
    getAllRequirements,
    getFilteredRequirements,
    getRequirementById,
    getRequirementsByFrp,
    getRequirementsByUser,
    updateRequirement
} from './requirements.controller.js'

export {
    createCollectorConsumer,
    createCollectorSource, createManufacturingProcess, createProduct, createRecycleProcess, createRequirement, createTreatment,
    createTreatmentProcess,
    deleteCollector,
    deleteCollectorConsumer,
    deleteCollectorSource, deleteManufacturingProcess, deleteProduct, deleteRecycleProcess, deleteRequirement, deleteTreatment,
    deleteTreatmentProcess,
    deleteWaste,
    getAllCollectors,
    getAllProducts, getAllRecycleProcesses, getAllRecyclers, getAllRequirements, getAllTreatmentMethods, getAllTreatmentProcesses,
    getAllTreatments,
    getAllWasteEntries,
    getCollectorById,
    getCollectorsByProximity,
    getConsumersByCollector,
    getFilteredProducts, getFilteredRecycleProcesses, getFilteredRecyclers, getFilteredRequirements, getFilteredTreatments,
    getFilteredWaste, getFrp, getManufacturingProcessById,
    getManufacturingProcessesByUser, getProductById,
    getProductsByFrp,
    getProductsByUser, getRecycleProcessById,
    getRecycleProcessesByRecycler, getRecyclerById, getRequirementById,
    getRequirementsByFrp, getRequirementsByUser, getSourcesByCollector, getSystemDefaults, getTreatmentById,
    getTreatmentProcessById,
    getTreatmentProcessesByRecycler,
    getTreatmentsByRecycler, getUserById, getWasteById,
    getWasteEntriesByFrp,
    getWasteEntriesOfUser,
    loginUser,
    loginWithGoogle,
    registerCollector,
    registerRecycler,
    signupWithEmail,
    signupWithGoogle,
    updateCollector, updateManufacturingProcess, updateProduct, updateRecycleProcess, updateRequirement, updateTreatment,
    updateTreatmentProcess,
    updateWaste,
    uploadWaste
}

export { getFacetOptions, search } from './search.controller.js'

