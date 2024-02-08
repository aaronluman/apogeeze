import {ListingService} from '../../src/service/listingService';
import {describe} from "node:test";

describe('Listing Service', () => {
    let listingService: ListingService;
    let mockListingRepository: any;

    beforeEach(() => {
        mockListingRepository = jest.mock('../../src/database/listing')
        listingService = new ListingService(mockListingRepository);
    })

    afterEach(() => {
        jest.clearAllMocks();
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
