import { sum } from '../test';
describe('Test cases', () => {
    test('sum 4 + 7 = 11', () => {
        expect(sum(4, 7)).toEqual(11);
    });
});
