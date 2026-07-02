import { prisma } from '../db/prisma.js';
import { lookupSyncService } from '../services/lookupSync.service.js';

async function backfill() {
    const wastes = await prisma.frp_wastes.findMany({ select: { id: true } });
    for (const w of wastes) await lookupSyncService.syncLookupEntry('waste', w.id);
    console.log(`synced ${wastes.length} wastes`);

    const products = await prisma.products.findMany({ select: { id: true } });
    for (const p of products) await lookupSyncService.syncLookupEntry('product', p.id);
    console.log(`synced ${products.length} products`);

    const requirements = await prisma.frp_requirements.findMany({ select: { id: true } });
    for (const r of requirements) await lookupSyncService.syncLookupEntry('requirement', r.id);
    console.log(`synced ${requirements.length} requirements`);
}

backfill().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });