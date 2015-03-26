System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  },
  "shim": {
    "packages": {
      "typeahead.js": {
        "main": "typeahead.js",
        "format": "global",
        "deps": "jquery",
        "exports": "$"
      }
    }
  }
});

System.config({
  "map": {
    "JWally/jsLPSolver": "github:JWally/jsLPSolver@master",
    "jquery": "github:components/jquery@2.1.3",
    "jsLPSolver": "github:JWally/jsLPSolver@master",
    "lodash": "npm:lodash@2.4.1",
    "typeahead.js": "npm:typeahead.js@0.10.5",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@2.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:typeahead.js@0.10.5": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

