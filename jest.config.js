module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  globals: {
    "vue-jest": {
      pug: {
        doctype: "html"
      }
    }
  },
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    "vue"
  ],
  moduleNameMapper: {
    "^@/(((?!ipfs).)*)$": "<rootDir>/src/$1", // Any library except IPFS
    "vuetify/lib(.*)": "<rootDir>/node_modules/vuetify/es5$1",
    "@polkadot/ui-keyring": "<rootDir>/tests/unit/@polkadot-ui-keyring.mock.js",
    "@polkadot/keyring": "<rootDir>/tests/unit/@polkadot-keyring.mock.js",
    "@polkadot/api": "<rootDir>/tests/unit/@polkadot-api.mock.js",
    "@/common/lib/ipfs": "<rootDir>/tests/unit/ipfs-index.mock.js",
    "@/common/lib/ipfs/ipfs-worker": "<rootDir>/tests/unit/ipfs-worker.mock.js",
    "@/common/lib/ipfs/crypt-worker": "<rootDir>/tests/unit/crypt-worker.mock.js"
  },
  modulePaths: [
    "<rootDir>/src",
    "<rootDir>/node_modules"
  ],
  transform: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.ts?$": "ts-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(vuetify|@debionetwork)/)"
  ]
}
