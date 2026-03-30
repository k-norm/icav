function buildComparisonData(conditionStats, accessibilityStats) {
    const accessibilityByProvince = new Map(
        accessibilityStats.map(item => [item.province, item])
    );

    return conditionStats
        .filter(item => accessibilityByProvince.has(item.province))
        .map(item => {
            const accessibility = accessibilityByProvince.get(item.province);
            return {
                province: item.province,
                good_percent: item.good_percent,
                accessible_percent: accessibility.accessible_percent,
                total_facilities: item.total_facilities || accessibility.total_facilities || 0,
                gap: Math.abs(accessibility.accessible_percent - item.good_percent)
            };
        })
        .sort((left, right) => left.good_percent - right.good_percent);
}

function calculateMetrics(data) {
    const count = data.length;
    if (!count) {
        return {
            slope: 0,
            intercept: 0,
            correlation: 0,
            closest: null
        };
    }

    const sums = data.reduce((accumulator, item) => {
        accumulator.sumX += item.good_percent;
        accumulator.sumY += item.accessible_percent;
        accumulator.sumXY += item.good_percent * item.accessible_percent;
        accumulator.sumX2 += item.good_percent * item.good_percent;
        accumulator.sumY2 += item.accessible_percent * item.accessible_percent;
        return accumulator;
    }, { sumX: 0, sumY: 0, sumXY: 0, sumX2: 0, sumY2: 0 });

    const denominator = (count * sums.sumX2) - (sums.sumX * sums.sumX);
    const slope = denominator === 0 ? 0 : ((count * sums.sumXY) - (sums.sumX * sums.sumY)) / denominator;
    const intercept = (sums.sumY - (slope * sums.sumX)) / count;
    const correlationNumerator = (count * sums.sumXY) - (sums.sumX * sums.sumY);
    const correlationDenominator = Math.sqrt(
        ((count * sums.sumX2) - (sums.sumX * sums.sumX)) *
        ((count * sums.sumY2) - (sums.sumY * sums.sumY))
    );
    const correlation = correlationDenominator === 0 ? 0 : correlationNumerator / correlationDenominator;
    const closest = data.reduce((best, item) => item.gap < best.gap ? item : best, data[0]);

    return {
        slope,
        intercept,
        correlation,
        closest
    };
}

function describeCorrelation(correlation) {
    const strength = Math.abs(correlation);
    if (strength >= 0.7) {
        return correlation >= 0
            ? 'Strong positive dependence between good condition and accessibility.'
            : 'Strong inverse dependence between good condition and accessibility.';
    }
    if (strength >= 0.4) {
        return correlation >= 0
            ? 'Moderate positive dependence: accessibility generally rises with good condition.'
            : 'Moderate inverse dependence: accessibility generally falls as good condition rises.';
    }
    if (strength >= 0.2) {
        return correlation >= 0
            ? 'Weak positive dependence with noticeable variation between provinces.'
            : 'Weak inverse dependence with noticeable variation between provinces.';
    }
    return 'Little visible dependence: provinces vary widely around the trend.';
}

module.exports = {
    buildComparisonData,
    calculateMetrics,
    describeCorrelation
};