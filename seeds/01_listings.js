const { randomUUID } = require('crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const eventIdA = randomUUID();
  const eventIdB = randomUUID();

  // Deletes ALL existing entries
  await knex('listing').del()
  await knex('listing').insert([
      // event a, section 100, 2 seats
    { id: randomUUID(), event_id: eventIdA, price: 100, quantity: 2, section: '100', row: '1' },
    { id: randomUUID(), event_id: eventIdA, price: 120, quantity: 2, section: '100', row: '2' },
    { id: randomUUID(), event_id: eventIdA, price: 140, quantity: 2, section: '100', row: '3' },
    { id: randomUUID(), event_id: eventIdA, price: 160, quantity: 2, section: '100', row: '4' },
    { id: randomUUID(), event_id: eventIdA, price: 180, quantity: 2, section: '100', row: '5' },

      // event b, section 100, 2 seats
    { id: randomUUID(), event_id: eventIdB, price: 60, quantity: 2, section: '100', row: '1' },

      // event a, section 2xx, 2 and 4 seats
    { id: randomUUID(), event_id: eventIdA, price: 120, quantity: 2, section: '220', row: '5' },
    { id: randomUUID(), event_id: eventIdA, price: 130, quantity: 4, section: '220', row: '3' },
    { id: randomUUID(), event_id: eventIdA, price: 140, quantity: 2, section: '220', row: '10' },
    { id: randomUUID(), event_id: eventIdA, price: 150, quantity: 4, section: '220', row: '8' },
    { id: randomUUID(), event_id: eventIdA, price: 120, quantity: 2, section: '230', row: '5' },
    { id: randomUUID(), event_id: eventIdA, price: 130, quantity: 4, section: '230', row: '3' },
    { id: randomUUID(), event_id: eventIdA, price: 140, quantity: 2, section: '240', row: '10' },
    { id: randomUUID(), event_id: eventIdA, price: 150, quantity: 4, section: '240', row: '8' },
    { id: randomUUID(), event_id: eventIdA, price: 120, quantity: 2, section: '220', row: '5' },
    { id: randomUUID(), event_id: eventIdA, price: 130, quantity: 4, section: '220', row: '3' },
    { id: randomUUID(), event_id: eventIdA, price: 140, quantity: 2, section: '250', row: '10' },
    { id: randomUUID(), event_id: eventIdA, price: 150, quantity: 4, section: '250', row: '8' },

      // event a, section 150, 2, 4, and 6 seats
    { id: randomUUID(), event_id: eventIdA, price: 200, quantity: 2, section: '150', row: '1' },
    { id: randomUUID(), event_id: eventIdA, price: 210, quantity: 4, section: '150', row: '1' },
    { id: randomUUID(), event_id: eventIdA, price: 220, quantity: 6, section: '150', row: '1' },
    { id: randomUUID(), event_id: eventIdA, price: 180, quantity: 2, section: '150', row: '4' },
    { id: randomUUID(), event_id: eventIdA, price: 190, quantity: 4, section: '150', row: '4' },
    { id: randomUUID(), event_id: eventIdA, price: 200, quantity: 6, section: '150', row: '4' },
    { id: randomUUID(), event_id: eventIdA, price: 140, quantity: 2, section: '150', row: '8' },
    { id: randomUUID(), event_id: eventIdA, price: 150, quantity: 4, section: '150', row: '8' },
    { id: randomUUID(), event_id: eventIdA, price: 160, quantity: 6, section: '150', row: '8' },
    { id: randomUUID(), event_id: eventIdA, price: 100, quantity: 2, section: '150', row: '10' },
    { id: randomUUID(), event_id: eventIdA, price: 110, quantity: 4, section: '150', row: '10' },
    { id: randomUUID(), event_id: eventIdA, price: 120, quantity: 6, section: '150', row: '10' },
  ]);
};
