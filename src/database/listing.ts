import knex from "knex";
import {match} from "assert";

interface Listing {
    id: string;
    event_id: string;
    price: number;
    quantity: number;
    section: string;
    row: string;
}

interface ListingFilter {
    field: keyof Listing;
    operator: '=' | '<>' | '>=' | '<=' | 'in' | 'not in' | 'between';
    value: number|string|number[]|string[];
}

class ListingQueries {
    protected tableName: string = 'listing';
    protected connection: knex.Knex;

    constructor(connection: knex.Knex) {
        this.connection = connection;
    }

    async list(): Promise<Listing[]> {
        return this.connection<Listing>(this.tableName);
    }

    findMany(filters: ListingFilter[]): Promise<Listing[]> {
        const queryBuilder = this.connection<Listing>(this.tableName);
        filters.map(filter => {
            switch (filter.operator) {
                case 'in':
                    // @ts-ignore
                    queryBuilder.whereIn(filter.field, filter.value);
                    break;
                case 'not in':
                    // @ts-ignore
                    queryBuilder.whereNotIn(filter.field, filter.value);
                    break;
                case 'between':
                    // @ts-ignore
                    queryBuilder.whereBetween(filter.field, filter.value);
                    break;
                default:
                    queryBuilder.where(filter.field, filter.operator, filter.value);
            }
        });

        return queryBuilder;
    }

    setPrice(id: string, price: number): Promise<Listing[]> {
        return this.connection<Listing>(this.tableName)
            .where('id', id)
            .update({ price })
            .returning('*');
    }
}

export { ListingQueries, ListingFilter, Listing };
