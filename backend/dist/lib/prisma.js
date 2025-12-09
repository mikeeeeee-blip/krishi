import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';
/**
 * Prisma Client Singleton
 * Prevents multiple instances in development (hot reload)
 * Optimized with connection pooling for production
 */
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: config.nodeEnv === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'pretty',
    datasources: {
        db: {
            url: config.databaseUrl,
        },
    },
});
// Prevent multiple instances in development
if (config.nodeEnv !== 'production') {
    globalForPrisma.prisma = prisma;
}
// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
export default prisma;
//# sourceMappingURL=prisma.js.map