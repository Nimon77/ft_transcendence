// vetur.config.js
// for the VS Code extension vetur
/** @type {import('vls').VeturConfig} */
module.exports = {
	// **optional** default: `{}`
	// override vscode settings
	// Notice: It only affects the settings used by Vetur.
	settings: {
	  "vetur.useWorkspaceDependencies": true,
	  "vetur.experimental.templateInterpolationService": true
	},
	// **optional** default: `[{ root: './' }]`
	// support monorepos
	projects: [
	  './fronted', // Shorthand for specifying only the project root location
	  './backend'
	]
  }
