import { frpService } from '../services/frp.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getFrp = asyncHandler(
    async (req, res) => {
        const frpEntries = await frpService.getFrp(req);
        res
            .status(200)
            .json(new ApiResponse(200, frpEntries, 'FRP entries retrieved successfully'));
    }
);

export { getFrp };