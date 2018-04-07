const StepType = Object.freeze({
    Point: 'point',
    Walking: 'walking',
    Transit: 'transit',

    getAll: () => {
        return [
            StepType.Point,
            StepType.Walking,
            StepType.Transit,
        ];
    },

    isValid: (value) => {
        return StepType.getAll().includes(value);
    },
});

module.exports = StepType;
