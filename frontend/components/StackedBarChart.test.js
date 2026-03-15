/* @jest-environment jsdom */

require('@testing-library/jest-dom');
const { render, screen, waitFor } = require('@testing-library/react');
const React = require('react');
const { StackedBarChart, COLOURS, getScale, getSegments, getBarHeights } = require('./StackedBarChart');

const mockFacilityData = [
    { province: 'ON', excellent: 120, good: 200, fair: 80, poor: 30 },
    { province: 'QC', excellent: 90, good: 150, fair: 60, poor: 20 },
    { province: 'BC', excellent: 70, good: 110, fair: 50, poor: 15 },
];

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
    mockFetch.mockClear();
});

// --- React component tests ---

describe('StackedBarChart component', () => {

    test('renders table headers', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockFacilityData,
        });
        render(React.createElement(StackedBarChart));
        await waitFor(() => {
            expect(screen.getByText('Province')).toBeInTheDocument();
            expect(screen.getByText('Excellent')).toBeInTheDocument();
            expect(screen.getByText('Good')).toBeInTheDocument();
            expect(screen.getByText('Fair')).toBeInTheDocument();
            expect(screen.getByText('Poor')).toBeInTheDocument();
        });
    });

    test('shows error state when response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false });
        render(React.createElement(StackedBarChart));
        await waitFor(() => {
            expect(document.body.innerHTML).toContain('Error loading chart');
        });
    });

});

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
        const totalHeight = d => getBarHeights(d, scale).reduce((sum, seg) => sum + seg.height, 0);
        expect(totalHeight(mockFacilityData[0])).toBeGreaterThan(totalHeight(mockFacilityData[2]));
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

    test('scale is height divided by max total', () => {
        const height = 320;
        expect(getScale(mockFacilityData, height)).toBeCloseTo(height / 430);
    });

});

// --- Condition colours ---

describe('Condition colours', () => {
    test('each condition uses the correct colour', () => {
        const segs = getSegments(mockFacilityData[0]);
        expect(segs[0].colour).toBe(COLOURS.excellent);
        expect(segs[1].colour).toBe(COLOURS.good);
        expect(segs[2].colour).toBe(COLOURS.fair);
        expect(segs[3].colour).toBe(COLOURS.poor);
    });

    test('no two conditions share the same colour', () => {
        const colours = Object.values(COLOURS);
        expect(new Set(colours).size).toBe(colours.length);
    });

    test('all segments have a non-empty colour', () => {
        mockFacilityData.forEach(d => {
            getSegments(d).forEach(seg => expect(seg.colour).toBeTruthy());
        });
    });
});