const Jasmine = require('jasmine');
const jasmine = new Jasmine({projectBaseDir: __dirname});

require('zone.js');
require('zone.js/dist/zone-testing');

const {TestBed} = require('@angular/core/testing');
const {ServerTestingModule, platformServerTesting} = require('@angular/platform-server/testing');

const testBed = TestBed.initTestEnvironment(
  ServerTestingModule,
  platformServerTesting()
);

var _resetTestingModule = testBed.resetTestingModule;

// Monkey-patch the resetTestingModule to destroy fixtures outside of a try/catch block.
// With https://github.com/angular/angular/commit/2c5a67134198a090a24f6671dcdb7b102fea6eba
// errors when destroying components are no longer causing Jasmine to fail.
testBed.resetTestingModule = function() {
  try {
    this._activeFixtures.forEach(function (fixture) { fixture.destroy(); });
  } finally {
    this._activeFixtures = [];
    // Regardless of errors or not, run the original reset testing module function.
    _resetTestingModule.call(this);
  }
};

// Angular's testing package resets the testing module before each test. This doesn't work well
// for us because it doesn't allow developers to see what test actually failed.
// Fixing this by resetting the testing module after each test.
// https://github.com/angular/angular/blob/master/packages/core/testing/src/before_each.ts#L25
afterEach(function() {
  testBed.resetTestingModule();
});

jasmine.loadConfigFile('./jasmine.json');
jasmine.execute();
