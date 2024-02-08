/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  knex.schema.createTable('listing', table => {
      table.uuid('id', {primaryKey:true});
      table.uuid('event_id');
      table.decimal('price', 8, 2);
      table.integer('quantity');
      table.string('section', 50);
      table.string('row', 50);
  }).then(() => console.log('listing table created'));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    knex.schema.dropTableIfExists('listing');
};
