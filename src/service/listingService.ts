import {Listing, ListingFilter, ListingQueries} from '../database/listing';

interface RepriceRequest {
    eventId: string;
    listingId: string;
    section: string;
    row: string;
    quantity: number;
    cost: number;
    currentPrice: number;
}

interface RankedListing extends Listing {
    similarityScore?: number;
}

interface EventSeatMap {}

class ListingService {
    protected readonly minimumMatchingListings: number = 5;
    protected readonly minimumMargin: number = 1.2;

    constructor(protected readonly listingRepository: ListingQueries) {
    }

    async getBestMatches(request: RepriceRequest): Promise<Listing[]> {
        // @ts-ignore
        const queryFilter: { [key in keyof Listing]?: ListingFilter } = {
            id: {field: 'id', operator: '<>', value: request.listingId},
            event_id: {field: 'event_id', operator: '=', value: request.eventId},
            section: {field: 'section', operator: '=', value: request.section},
            quantity: {field: 'quantity', operator: '=', value: request.quantity},
        };

        let listings = await this.listingRepository.findMany(Object.values(queryFilter));

        if (listings.length >= this.minimumMatchingListings) {
            return listings;
        }

        queryFilter.section = await this.getExpandedSectionList(request.eventId, request.section);
        listings = await this.listingRepository
            .findMany(Object.values(queryFilter))
            .then(result => this.filterExpandedSearchResults(request, result));

        if (listings.length >= this.minimumMatchingListings) {
            return listings;
        }

        delete queryFilter.quantity;
        listings = await this.listingRepository
            .findMany(Object.values(queryFilter))
            .then(result => this.filterExpandedSearchResults(request, result));

        return listings;
    }

    async reprice(request: RepriceRequest, matches: RankedListing[]): Promise<Listing> {
        const targetMatch = matches
            .sort((a: RankedListing, b: RankedListing) => a.price - b.price)
            .at(0);

        const targetPrice = (targetMatch?.price || 0) - 1;
        if (targetPrice < (request.cost * this.minimumMargin)) {
            throw new Error(`Target price of ${targetPrice} is below the minimum allowed`)
        }

        const getDefaultListing = (request: RepriceRequest, targetPrice: number): Listing => {
            return {
                id: request.listingId,
                event_id: request.eventId,
                price: targetPrice,
                quantity: request.quantity,
                section: request.section,
                row: request.row,
            };
        }

        return this.listingRepository.setPrice(request.listingId, targetPrice)
            // knex update.returning() returns a list of items
            .then(result => {
                if (result.length) {
                    return result[0];
                }
                return getDefaultListing(request, targetPrice);
            })
            .catch(error => {
                console.log(error);
                return getDefaultListing(request, targetPrice);
            });
    }

    /**
     * Apply heuristic to the expanded search results to find relevant matches
     */
    async filterExpandedSearchResults(request: RepriceRequest, listings: RankedListing[]): Promise<Listing[]> {
        const seatMap = await this.getVenueSeatMapData(request.eventId);
        return listings.map((listing: RankedListing) => {
            listing.similarityScore = this.compareQuantity(request.quantity, listing.quantity)
                * this.compareRows(seatMap, request.row, listing.row)
                * this.compareSections(seatMap, request.section, listing.section);

            return listing;
        })
            .sort((a: RankedListing, b: RankedListing) => (b.similarityScore || 0) - (a.similarityScore || 0))
            .slice(0, Math.max(this.minimumMatchingListings, Math.ceil(listings.length / 2)));
    }

    compareQuantity(sourceQuantity: number, targetQuantity: number): number {
        const distance = Math.abs(sourceQuantity - targetQuantity);
        return Math.min(1, 1 / Math.pow(distance, .5));
    }

    /**
     * @return number between 0 and 1 where 1 indicates high degree of comparability
     */
    compareRows(_eventData: EventSeatMap, sourceRow: string, targetRow: string): number {
        // Use data about the venue to convert the row values into numbers. For example, theaters that use single letters
        // for the first 26 rows, followed by double letters.
        // for this example we are only using numbers for the row identifiers
        const distance = Math.abs(Number(sourceRow) - Number(targetRow))
        return Math.min(1, 1 / Math.pow(distance, .3))
    }

    /**
     * Like getExpandedSectionList this would use the seat map data to logically compare sections for equivalence.
     * For example, with Allegiant Stadium, 204, 205, 206, 207, 219, 220, 221, 222, 228, 229, 230, 231, 243, 244, 245, and 246
     * would be given high comparability scores with each other.
     * @see https://www.allegiantstadium.com/assets/img/Seating-Section-Map_Premium_BLACK_052523-17745ae1a9.jpg
     *
     * for this proof of concept we will just be comparing the numerical distance between source and target, assuming all
     * levels have sections equally spaced between x00 and x99
     *
     * @return number between 0 and 1 where 1 indicates high degree of comparability
     */
    compareSections(_eventData: EventSeatMap, sourceSection: string, targetSection: string): number {
        return 1 - Math.min(
            Math.abs(Number(sourceSection) - Number(targetSection)),
            // for this algorithm, sections 0 and 99 are next to each other
            100 - Math.abs(Number(sourceSection) - Number(targetSection))
        ) / 100;
    }

    /**
     * placeholder
     */
    async getVenueSeatMapData(_eventId: string): Promise<EventSeatMap> {
        return {key: 'some value'};
    }

    /**
     * This would ideally utilize the seat map data / service to get a list of sections that could be considered comparable
     * to the target section.
     * For the purpose of this proof of concept we will consider all sections on the same level as comparable
     *
     * @param {string} _eventId used to determine the venue or get map for special events
     * @param {string} section
     */
    async getExpandedSectionList(_eventId: string, section: string): Promise<ListingFilter> {
        return {field: 'section', operator: 'between', value: [section.slice(0,1) + '00', section.slice(0,1) + '99']}
    }
}

export { RepriceRequest, ListingService };
