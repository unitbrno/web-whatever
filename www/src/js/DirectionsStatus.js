const DirectionsStatus = Object.freeze({
    Loading: 'loading',
    Found: 'found',
    OnlyWalking: 'only_walking',
    NoRoute: 'no_route',

    getAll: () => {
        return [
            DirectionsStatus.Loading,
            DirectionsStatus.Found,
            DirectionsStatus.OnlyWalking,
            DirectionsStatus.NoRoute,
        ];
    },

    isValid: (value) => {
        return DirectionsStatus.getAll().includes(value);
    },
});

module.exports = DirectionsStatus;
