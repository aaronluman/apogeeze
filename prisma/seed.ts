import { PrismaClient } from '@prisma/client'
import {randomUUID} from "crypto";
const prisma = new PrismaClient()
async function main() {
    const eventIdA = randomUUID();
    const eventIdB = randomUUID();
    const listings = [

        // event a section 100 tickets with quantity match
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '120',
                quantity: 2,
                section: '100',
                row: '1',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '140',
                quantity: 2,
                section: '100',
                row: '2',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '160',
                quantity: 2,
                section: '100',
                row: '3',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '130',
                quantity: 2,
                section: '100',
                row: '4',
            },
        }),

        // event b section 100
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdB,
                price: '50',
                quantity: 2,
                section: '100',
                row: '4',
            },
        }),

        // event a section 150 tickets with no quantity match
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '220',
                quantity: 4,
                section: '150',
                row: '1',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '240',
                quantity: 4,
                section: '150',
                row: '2',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '210',
                quantity: 4,
                section: '150',
                row: '3',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '250',
                quantity: 6,
                section: '150',
                row: '4',
            },
        }),

        // event a section 2x best match
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '100',
                quantity: 2,
                section: '200',
                row: '4',
            },
        }),
        await prisma.listing.upsert({
            where: { id: 'a' },
            update: {},
            create: {
                event_id: eventIdA,
                price: '100',
                quantity: 2,
                section: '200',
                row: '4',
            },
        }),

    ];

    console.log({listings});
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
