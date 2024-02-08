import {randomUUID} from 'crypto';
import {describe} from 'node:test';

import {Listing, ListingQueries} from '../../src/database/listing';
import {ListingService, RankedListing, RepriceRequest} from '../../src/service/listingService';

describe('Listing Service', () => {
    let listingService: ListingService;
    const findManyMock = jest.fn();
    const setPriceMock = jest.fn();

    beforeEach(() => {
        jest.spyOn(ListingQueries.prototype, 'findMany').mockImplementation(findManyMock);
        jest.spyOn(ListingQueries.prototype, 'setPrice').mockImplementation(setPriceMock);
        listingService = new ListingService(new ListingQueries(jest.mock('../../src/database/connection') as any));
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getBestMatches', () => {
        const request: RepriceRequest = {
            listingId: randomUUID(),
            eventId: randomUUID(),
            quantity: 2,
            section: '100',
            row: '5',
            cost: 99,
            currentPrice: 100,
        };

        const generateListing = (request: RepriceRequest, options: {quantity?: number, section?: string, row?: string}): Listing => {
            return {
                id: randomUUID(),
                event_id: request.eventId,
                quantity: options.quantity || request.quantity,
                section: options.section || request.section,
                row: options.row || request.row,
                price: request.currentPrice,
            }
        }

        test('gets section and quantity matches', async () => {
            const findManyResponse = [
                generateListing(request, {row: '1'}),
                generateListing(request, {row: '2'}),
                generateListing(request, {row: '3'}),
                generateListing(request, {row: '4'}),
                generateListing(request, {row: '5'}),
            ];
            findManyMock.mockReturnValue(Promise.resolve(findManyResponse));

            const result = await listingService.getBestMatches(request);
            expect(result).toEqual(findManyResponse);
            expect(findManyMock).toHaveBeenCalledTimes(1);
            expect(findManyMock).toHaveBeenCalledWith([
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: '=', value: request.section},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
        });

        test('makes first fallback call', async () => {
            const findManyResponse1 = [
                generateListing(request, {row: '1'}),
                generateListing(request, {row: '2'}),
                generateListing(request, {row: '3'}),
                generateListing(request, {row: '4'}),
            ];
            const findManyResponse2 = [...findManyResponse1];
            findManyResponse2.push(generateListing(request, {section: '101', row: '5'}));
            findManyMock
                .mockReturnValueOnce(Promise.resolve(findManyResponse1))
                .mockReturnValueOnce(Promise.resolve(findManyResponse2));

            const result = await listingService.getBestMatches(request);
            expect(result.length).toEqual(5);
            expect(findManyMock).toHaveBeenCalledTimes(2);
            expect(findManyMock).toHaveBeenNthCalledWith(1, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: '=', value: request.section},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
            expect(findManyMock).toHaveBeenNthCalledWith(2, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: 'between', value: ['100', '199']},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
        });

        test('makes second fallback call', async () => {
            const findManyResponse1 = [
                generateListing(request, {row: '1'}),
                generateListing(request, {row: '2'}),
                generateListing(request, {row: '3'}),
            ];
            const findManyResponse2 = [
                ...findManyResponse1,
                generateListing(request, {section: '101', row: '4'}),
            ];
            const findManyResponse3 = [
                ...findManyResponse2,
                generateListing(request, {section: '100', quantity: 4, row: '5'}),
                generateListing(request, {section: '100', quantity: 4, row: '6'}),
                generateListing(request, {section: '100', quantity: 4, row: '7'}),
            ];
            findManyMock
                .mockReturnValueOnce(Promise.resolve(findManyResponse1))
                .mockReturnValueOnce(Promise.resolve(findManyResponse2))
                .mockReturnValueOnce(Promise.resolve(findManyResponse3));

            const result = await listingService.getBestMatches(request);
            expect(result.length).toEqual(5);
            expect(findManyMock).toHaveBeenCalledTimes(3);
            expect(findManyMock).toHaveBeenNthCalledWith(1, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: '=', value: request.section},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
            expect(findManyMock).toHaveBeenNthCalledWith(2, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: 'between', value: ['100', '199']},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
            expect(findManyMock).toHaveBeenNthCalledWith(3, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: 'between', value: ['100', '199']},
            ]);
        });

        test('gets many results to first fallback call', async () => {
            const findManyResponse1 = [
                generateListing(request, {row: '1'}),
                generateListing(request, {row: '2'}),
                generateListing(request, {row: '3'}),
                generateListing(request, {row: '4'}),
            ];
            const findManyResponse2 = [
                ...findManyResponse1,
                generateListing(request, {section: '101', row: '5'}),
                generateListing(request, {section: '102', row: '6'}),
                generateListing(request, {section: '103', row: '7'}),
                generateListing(request, {section: '104', row: '8'}),
                generateListing(request, {section: '105', row: '9'}),
                generateListing(request, {section: '106', row: '10'}),
                generateListing(request, {section: '107', row: '11'}),
                generateListing(request, {section: '108', row: '12'}),
                generateListing(request, {section: '109', row: '13'}),
                generateListing(request, {section: '109', row: '14'}),
            ];
            findManyMock
                .mockReturnValueOnce(Promise.resolve(findManyResponse1))
                .mockReturnValueOnce(Promise.resolve(findManyResponse2));

            const result = await listingService.getBestMatches(request);
            expect(result.length).toEqual(7);
            expect(findManyMock).toHaveBeenCalledTimes(2);
            expect(findManyMock).toHaveBeenNthCalledWith(1, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: '=', value: request.section},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
            expect(findManyMock).toHaveBeenNthCalledWith(2, [
                {field: 'id', operator: '<>', value: request.listingId},
                {field: 'event_id', operator: '=', value: request.eventId},
                {field: 'section', operator: 'between', value: ['100', '199']},
                {field: 'quantity', operator: '=', value: request.quantity},
            ]);
        });
    });

    describe('reprice', () => {
        const request: RepriceRequest = {
            listingId: randomUUID(),
            eventId: randomUUID(),
            quantity: 2,
            section: '100',
            row: '5',
            cost: 99,
            currentPrice: 100,
        };

        test('updates price and returns existing listing', async () => {
            const setPriceResponse = {
                id: request.listingId,
                event_id: request.eventId,
                quantity: request.quantity,
                section: request.section,
                row: request.row,
                price: 119,
            };
            setPriceMock.mockReturnValue(Promise.resolve([setPriceResponse]));
            const matches = [
                {price: 130} as RankedListing,
                {price: 120} as RankedListing,
                {price: 140} as RankedListing,
            ]
            const result = await listingService.reprice(request, matches);
            expect(result).toEqual(setPriceResponse);
            expect(setPriceMock).toHaveBeenCalledWith(request.listingId, 119);
        });

        test('sets price for listing not found', async () => {
            const setPriceResponse = {
                event_id: request.eventId,
                quantity: request.quantity,
                section: request.section,
                row: request.row,
                price: 119,
            };
            setPriceMock.mockReturnValue(Promise.resolve([]));
            const matches = [
                {price: 130} as RankedListing,
                {price: 120} as RankedListing,
                {price: 140} as RankedListing,
            ]
            const result = await listingService.reprice(request, matches);
            expect(result).toEqual(setPriceResponse);
            expect(setPriceMock).toHaveBeenCalledWith(request.listingId, 119);
        });

        test('sets price for listing but error on update', async () => {
            const setPriceResponse = {
                event_id: request.eventId,
                quantity: request.quantity,
                section: request.section,
                row: request.row,
                price: 119,
            };
            setPriceMock.mockReturnValue(Promise.reject(new Error()));
            const matches = [
                {price: 130} as RankedListing,
                {price: 120} as RankedListing,
                {price: 140} as RankedListing,
            ]
            const result = await listingService.reprice(request, matches);
            expect(result).toEqual(setPriceResponse);
            expect(setPriceMock).toHaveBeenCalledWith(request.listingId, 119);
        });

        test('throws error when price too low', async () => {
            const matches = [
                {price: 100} as RankedListing,
                {price: 120} as RankedListing,
                {price: 140} as RankedListing,
            ]
            expect(async () => {
                await listingService.reprice(request, matches)
            }).rejects.toThrow();
            expect(setPriceMock).not.toHaveBeenCalled();
        });
    });

    describe('compareQuantity', () => {
        [
            { a: 2, b: 2, result: 1},
            { a: 2, b: 3, result: .96},
            { a: 2, b: 4, result: .92},
            { a: 2, b: 5, result: .88},
            { a: 2, b: 6, result: .84},
            { a: 2, b: 7, result: .8},
            { a: 2, b: 8, result: .76},
            { a: 2, b: 9, result: .72},
            { a: 2, b: 10, result: .68},
            { a: 2, b: 12, result: .60},
            { a: 4, b: 14, result: .60},
            { a: 2, b: 27, result: 0},
        ].forEach(input => {
            test(`returns the correct quantity comparison for ${input.a} -> ${input.b}`, () => {
                const resultA = listingService.compareQuantity(input.a, input.b);
                const resultB = listingService.compareQuantity(input.b, input.a);
                expect(resultA).toEqual(resultB);
                expect(resultA).toEqual(input.result);
            })
        })
    });

    describe('compareRows', () => {
        [
            { rowA: '1', rowB: '1', result: 1},
            { rowA: '1', rowB: '2', result: 0.9996},
            { rowA: '2', rowB: '3', result: 0.9996},
            { rowA: '1', rowB: '3', result: 0.9984},
            { rowA: '1', rowB: '4', result: 0.9964},
            { rowA: '1', rowB: '5', result: 0.9936},
            { rowA: '1', rowB: '11', result: 0.96},
            { rowA: '1', rowB: '16', result: 0.91},
            { rowA: '1', rowB: '21', result: 0.8400000000000001},
            { rowA: '1', rowB: '26', result: .75},
            { rowA: '1', rowB: '51', result: 0},
        ].forEach(input => {
            test(`returns the correct row distance for ${input.rowA} -> ${input.rowB}`, () => {
                const resultA = listingService.compareRows({}, input.rowA, input.rowB);
                const resultB = listingService.compareRows({}, input.rowB, input.rowA);
                expect(resultA).toEqual(resultB);
                expect(resultA).toEqual(input.result);
            })
        })
    });

    describe('compareSections', () => {
        [
            { sectionA: '101', sectionB: '199', result: .98},
            { sectionA: '125', sectionB: '150', result: .75},
            { sectionA: '175', sectionB: '150', result: .75},
            { sectionA: '100', sectionB: '150', result: .5},
            { sectionA: '100', sectionB: '100', result: 1},
        ].forEach(input => {
            test(`returns the correct section distance for ${input.sectionA} -> ${input.sectionB}`, () => {
                const resultA = listingService.compareSections({}, input.sectionA, input.sectionB);
                const resultB = listingService.compareSections({}, input.sectionB, input.sectionA);
                expect(resultA).toEqual(resultB);
                expect(resultA).toEqual(input.result);
            })
        })

    });

    describe('getExpandedSectionList', () => {
        [
            { section: '100', expectation: ['100', '199']},
            { section: '200', expectation: ['200', '299']},
            { section: '300', expectation: ['300', '399']},
        ].forEach(input => {
            test(`returns the correct range for section ${input.section}`, () => {
                const result = listingService.getExpandedSectionList({}, input.section);
                expect(result.field).toBe('section');
                expect(result.operator).toBe('between');
                expect(result.value).toEqual(input.expectation);
            })
        })
    })
})
