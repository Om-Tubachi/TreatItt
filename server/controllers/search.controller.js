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

export { getFacetOptions, search };
