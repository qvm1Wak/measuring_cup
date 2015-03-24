System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "jquery": "github:components/jquery@2.1.3",
    "lodash": "npm:lodash@2.4.1",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:lodash@2.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

