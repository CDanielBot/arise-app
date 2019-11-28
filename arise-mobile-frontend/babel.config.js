module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            styled: './styled',
            theme: './theme',
            ducks: './src/state/ducks',
            selectors: './src/state/selectors',
            shared: './src/components/shared',
            api: './src/api'
          }
        }
      ],
    ]
  }
}
