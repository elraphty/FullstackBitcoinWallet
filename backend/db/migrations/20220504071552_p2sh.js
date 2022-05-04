/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('p2sh', (t) => {
    t.increments('id').primary().notNullable();
    t.integer('userid').notNullable().references('id').inTable('users');
    t.string('address').notNullable().unique();
    t.text('redeem').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('p2sh');
};
