import { searchService } from '../services/search.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const search = asyncHandler(async (req, res) => {
    const results = await searchService.search(req);
    res
        .status(200)
        .json(new ApiResponse(200, results, 'Search results fetched successfully'));
});

const getFacetOptions = asyncHandler(async (req, res) => {
    const facets = await searchService.getFacetOptions(req);
    res
        .status(200)
        .json(new ApiResponse(200, facets, 'Facet options fetched successfully'));
});

const searchPins = asyncHandler(async (req, res) => {
    const pins = await searchService.searchPins(req);
    res
        .status(200)
        .json(new ApiResponse(200, pins, 'Map pins fetched successfully'));
});

export { getFacetOptions, search, searchPins };
