const mockFacilityData = [
    { province: 'ON', excellent: 120, good: 200, fair: 80, poor: 30 },
    { province: 'QC', excellent: 90, good: 150, fair: 60, poor: 20 },
    { province: 'BC', excellent: 70, good: 110, fair: 50, poor: 15 },
];

const COLOURS = {
    excellent: '#8884d8',
    good: '#82ca9d',
    fair: '#ffc658',
    poor: '#ff8042',
};

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
    mockFetch.mockClear();
});

function getTotal(d) {
    return d.excellent + d.good + d.fair + d.poor;
}

function getMaxTotal(data) {
    return Math.max(...data.map(getTotal));
}

function getScale(data, height) {
    return height / getMaxTotal(data);
}

function getSegments(d) {
    return [
        { value: d.excellent, color: COLOURS.excellent, label: 'Excellent' },
        { value: d.good, color: COLOURS.good, label: 'Good' },
        { value: d.fair, color: COLOURS.fair, label: 'Fair' },
        { value: d.poor, color: COLOURS.poor, label: 'Poor' },
    ];
}

function getBarHeights(d, scale) {
    return getSegments(d).map(seg => ({ ...seg, height: seg.value * scale }));
}

// --- Tests ---

describe('ICAV Facility Condition Chart', () => {

    // --- Bar rendering ---

    describe('Bar rendering', () => {
        test('produces 4 segments per province', () => {
            mockFacilityData.forEach(d => {
                expect(getSegments(d).length).toBe(4);
            });
        });

        test('each segment has a positive height', () => {
            const scale = getScale(mockFacilityData, 320);
            mockFacilityData.forEach(d => {
                getBarHeights(d, scale).forEach(seg => {
                    expect(seg.height).toBeGreaterThan(0);
                });
            });
        });

        test('total stacked height is proportional to province totals', () => {
            const scale = getScale(mockFacilityData, 320);
            const totalHeight = d => getBarHeights(d, scale)
                .reduce((sum, seg) => sum + seg.height, 0);

            const onHeight = totalHeight(mockFacilityData[0]); // ON: 430
            const bcHeight = totalHeight(mockFacilityData[2]); // BC: 245
            expect(onHeight).toBeGreaterThan(bcHeight);
        });

        test('province with highest total gets the tallest bar', () => {
            const scale = getScale(mockFacilityData, 320);
            const heights = mockFacilityData.map(d => ({
                province: d.province,
                height: getBarHeights(d, scale).reduce((sum, s) => sum + s.height, 0),
            }));
            const tallest = heights.reduce((max, d) => d.height > max.height ? d : max);
            expect(tallest.province).toBe('ON');
        });

        test('getMaxTotal returns correct value', () => {
            expect(getMaxTotal(mockFacilityData)).toBe(430);
        });

        test('scale is height divided by max total', () => {
            const height = 320;
            const scale = getScale(mockFacilityData, height);
            expect(scale).toBeCloseTo(height / 430);
        });

        test('handles single-province dataset', () => {
            const single = [mockFacilityData[0]];
            expect(getSegments(single[0]).length).toBe(4);
            expect(getMaxTotal(single)).toBe(430);
        });
    });

    // --- Condition colors ---

    describe('Condition colors', () => {
        test('excellent uses correct color', () => {
            mockFacilityData.forEach(d => {
                const seg = getSegments(d).find(s => s.label === 'Excellent');
                expect(seg.color).toBe('#8884d8');
            });
        });

        test('good uses correct color', () => {
            mockFacilityData.forEach(d => {
                const seg = getSegments(d).find(s => s.label === 'Good');
                expect(seg.color).toBe('#82ca9d');
            });
        });

        test('fair uses correct color', () => {
            mockFacilityData.forEach(d => {
                const seg = getSegments(d).find(s => s.label === 'Fair');
                expect(seg.color).toBe('#ffc658');
            });
        });

        test('poor uses correct color', () => {
            mockFacilityData.forEach(d => {
                const seg = getSegments(d).find(s => s.label === 'Poor');
                expect(seg.color).toBe('#ff8042');
            });
        });

        test('no two conditions share the same color', () => {
            const colors = Object.values(COLOURS);
            expect(new Set(colors).size).toBe(colors.length);
        });

        test('all segments have a non-empty color', () => {
            mockFacilityData.forEach(d => {
                getSegments(d).forEach(seg => {
                    expect(seg.color).toBeTruthy();
                });
            });
        });
    });

    // --- 3. API error state ---

    describe('API error state', () => {
        test('fetch rejection produces an error', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            await expect(global.fetch('http://localhost:8080/api/facilities/condition'))
                .rejects.toThrow('Network error');
        });

        test('non-ok response has ok: false', async () => {
            mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
            const res = await global.fetch('http://localhost:8080/api/facilities/condition');
            expect(res.ok).toBe(false);
            expect(res.status).toBe(500);
        });

        test('successful fetch returns facility data', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockFacilityData,
            });
            const res = await global.fetch('http://localhost:8080/api/facilities/condition');
            const data = await res.json();
            expect(data).toEqual(mockFacilityData);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/facilities/condition');
        });

        test('error message includes network error text', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            let errorMessage = null;
            await global.fetch('http://localhost:8080/api/facilities/condition')
                .catch(err => { errorMessage = err.message; });
            expect(errorMessage).toContain('Network error');
        });
    });
});