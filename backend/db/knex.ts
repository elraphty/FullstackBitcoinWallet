const env = process.env.NODE_ENV || 'development'

import {Knex, knex} from 'knex';
import {development, test, production} from '../knexfile';

let KnexSetup: Knex;
if (env === 'production') {
    KnexSetup = knex(production);
} else if (env === 'test') {
    KnexSetup = knex(test);
} else {
    KnexSetup = knex(development)
}

export default KnexSetup