module.exports = function (api) {
    api.cache.invalidate(() => process.env.GOOGLE_MAPS_API_KEY)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module:react-native-dotenv',
            ],
            [
                'react-native-reanimated/plugin',
            ]
        ]
    };
};
