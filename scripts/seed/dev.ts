import db from '../../src/modules/db';
import {randomUUID} from "crypto";

const run = async () => {
    const eventIdA = randomUUID();
    const eventIdB = randomUUID();
    await db.post.createMany({
        data: [
            {
                event_it: eventIdA,
                internal: false,
                price: 100,
                quantity: 2,
                section: '100',
                row: '1',
            },
            {
                event_it: eventIdA,
                internal: false,
                price: 100,
                quantity: 2,
                section: '100',
                row: '1',
            },
            {
                event_it: eventIdA,
                internal: false,
                price: 100,
                quantity: 2,
                section: '100',
                row: '1',
            },
            {
                event_it: eventIdA,
                internal: false,
                price: 100,
                quantity: 2,
                section: '100',
                row: '1',
            },
            {
                event_it: eventIdA,
                internal: true,
                price: 100,
                quantity: 2,
                section: '100',
                row: '1',
            },
        ]
    })
};

if (require.main === module) {
    run().then(() => {
        console.log('data seed complete');
        process.exit();
    });
}
