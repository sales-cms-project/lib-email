/** 
 * @type {import('ts-jest').JestConfigWithTsJest} 
*/
module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  preset: 'ts-jest',
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  testEnvironment: 'node'
};