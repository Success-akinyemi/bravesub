module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: '> 0.5%, not dead', // Define your target browser compatibility here
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-optional-chaining' // Add the optional chaining plugin
    ]
  };
  