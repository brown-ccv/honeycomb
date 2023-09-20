import { assert } from "chai";
import _ from "lodash";

import { deepCopy, formatDollars, jitter, jitter50, randomTrue } from "../utils";

describe("generic utility functions", function () {
  it("should jitter an integer", function () {
    assert.equal(jitter(100, 0), 100, "jittering by 0 returns base");
    assert.closeTo(jitter(100, 10), 100, 10, "jittering 100 by 10 is close to 100");
    assert.closeTo(jitter50(100), 100, 50, "jitter50 is 50 within 100");
  });

  it("should flip a coin", function () {
    assert.isBoolean(randomTrue(), "randomTrue is true or false");
    const flips = _.range(100).map((val) => randomTrue());
    const numTrue = _.sum(flips);
    assert.closeTo(numTrue, 50, 45, "of 100 flips should be some trues and some falses");
  });

  it("should deep copy an opject", function () {
    const obj = { a: 1, b: ["a"] };
    assert.deepEqual(deepCopy(obj), obj, "deep copied object should be equal");
    assert.notEqual(deepCopy(obj), obj, "deep copied objects not the same");
  });

  it("should format numbers as dollars", function () {
    assert.equal(formatDollars(2), "$2.00", "integer to dollars");
    assert.equal(formatDollars(2.5), "$2.50", "one decimal to dollars");
    assert.equal(formatDollars(2.66), "$2.66", "two decimal to dollars");
    assert.equal(formatDollars(2.123), "$2.12", "three decimal round down");
    assert.equal(formatDollars(2.456), "$2.46", "three decimal round up");
  });
});
