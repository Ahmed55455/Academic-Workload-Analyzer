// backend/tests/workloadLogic.test.js

const { 
    calculateCompletionRate, 
    getOverdueTasksCount, 
    getBusiestCourse 
} = require('../controllers/workloadLogic');

describe('Workload Logic Business Functions', () => {

    // 1. Testing calculateCompletionRate
    describe('calculateCompletionRate', () => {
        it('should return 0 if task list is empty', () => {
            expect(calculateCompletionRate([])).toBe(0);
        });

        it('should correctly calculate the percentage of completed tasks', () => {
            const tasks = [
                { status: 'completed' },
                { status: 'pending' },
                { status: 'completed' },
                { status: 'in-progress' }
            ]; // 2 out of 4 = 50%
            expect(calculateCompletionRate(tasks)).toBe(50);
        });

        it('should round to the nearest whole number', () => {
            const tasks = [
                { status: 'completed' },
                { status: 'pending' },
                { status: 'pending' }
            ]; // 1 out of 3 = 33.333...
            expect(calculateCompletionRate(tasks)).toBe(33);
        });
    });

    // 2. Testing getOverdueTasksCount
    describe('getOverdueTasksCount', () => {
        const mockCurrentDate = new Date('2026-05-15');

        it('should return 0 if there are no tasks', () => {
            expect(getOverdueTasksCount([], mockCurrentDate)).toBe(0);
        });

        it('should return the correct number of overdue tasks ignoring completed ones', () => {
            const tasks = [
                { status: 'pending', deadline: '2026-05-10' }, // Overdue
                { status: 'in-progress', deadline: '2026-05-14' }, // Overdue
                { status: 'completed', deadline: '2026-05-01' }, // Overdue but completed (should not count)
                { status: 'pending', deadline: '2026-05-20' }, // Future deadline
                { status: 'pending', deadline: null } // No deadline
            ];
            expect(getOverdueTasksCount(tasks, mockCurrentDate)).toBe(2);
        });
    });

    // 3. Testing getBusiestCourse
    describe('getBusiestCourse', () => {
        const mockCourses = [
            { id: 1, name: 'System Analysis and Design' },
            { id: 2, name: 'Data Structures' }
        ];

        it('should return null if there are no tasks or courses', () => {
            expect(getBusiestCourse([], [])).toBeNull();
        });

        it('should return the course object with the highest number of tasks', () => {
            const tasks = [
                { course_id: 1 },
                { course_id: 1 },
                { course_id: 2 }
            ];
            const result = getBusiestCourse(mockCourses, tasks);
            expect(result.name).toBe('System Analysis and Design');
        });
    });

});