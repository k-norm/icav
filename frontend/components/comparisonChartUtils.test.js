const {
    buildComparisonData,
    calculateMetrics,
    describeCorrelation
} = require('./comparisonChartUtils');

describe('comparisonChartUtils', () => {
    test('joins condition and accessibility stats by province and sorts by good condition', () => {
        const conditionStats = [
            { province: 'Ontario', good_percent: 40.0, total_facilities: 200 },
            { province: 'Alberta', good_percent: 35.0, total_facilities: 120 },
            { province: 'Nunavut', good_percent: 28.0, total_facilities: 40 }
        ];
        const accessibilityStats = [
            { province: 'Nunavut', accessible_percent: 46.0, total_facilities: 40 },
            { province: 'Ontario', accessible_percent: 71.0, total_facilities: 200 },
            { province: 'Alberta', accessible_percent: 63.0, total_facilities: 120 },
            { province: 'Quebec', accessible_percent: 67.0, total_facilities: 150 }
        ];

        const result = buildComparisonData(conditionStats, accessibilityStats);

        expect(result).toEqual([
            {
                province: 'Nunavut',
                good_percent: 28.0,
                accessible_percent: 46.0,
                total_facilities: 40,
                gap: 18.0
            },
            {
                province: 'Alberta',
                good_percent: 35.0,
                accessible_percent: 63.0,
                total_facilities: 120,
                gap: 28.0
            },
            {
                province: 'Ontario',
                good_percent: 40.0,
                accessible_percent: 71.0,
                total_facilities: 200,
                gap: 31.0
            }
        ]);
    });

    test('calculates positive dependence metrics for joined comparison data', () => {
        const data = [
            { province: 'A', good_percent: 20, accessible_percent: 45, gap: 25, total_facilities: 10 },
            { province: 'B', good_percent: 30, accessible_percent: 60, gap: 30, total_facilities: 12 },
            { province: 'C', good_percent: 40, accessible_percent: 75, gap: 35, total_facilities: 18 }
        ];

        const result = calculateMetrics(data);

        expect(result.slope).toBeCloseTo(1.5, 5);
        expect(result.intercept).toBeCloseTo(15, 5);
        expect(result.correlation).toBeCloseTo(1, 5);
        expect(result.closest).toEqual(data[0]);
    });

    test('returns neutral metrics when there is no data', () => {
        expect(calculateMetrics([])).toEqual({
            slope: 0,
            intercept: 0,
            correlation: 0,
            closest: null
        });
    });

    test('describes weak and strong relationships clearly', () => {
        expect(describeCorrelation(0.82)).toContain('Strong positive');
        expect(describeCorrelation(-0.48)).toContain('Moderate inverse');
        expect(describeCorrelation(0.05)).toContain('Little visible dependence');
    });
});