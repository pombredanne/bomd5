var assert = require("assert");
var BitLength = require("../lib/MD5")._BitLength;

suite("BitLength", function() {
    "use strict";

    test("new instance should equal to zero", function() {
        assert.deepEqual(new BitLength().toUint32Pair(), {"lo": 0, "hi": 0});
    });

    suite("#incByOctets", function() {
        test("should mutate the instance", function() {
            var instance = new BitLength();
            instance.incByOctets(1);
            assert.deepEqual(instance.toUint32Pair(), {"lo": 8, "hi": 0});
        });

        test("should increase the value by 8 bits for each octet", function() {
            var instance = new BitLength();
            instance.incByOctets(1);
            instance.incByOctets(1);
            assert.deepEqual(instance.toUint32Pair(), {"lo": 16, "hi": 0});
        });

        test("should handle 32-bit overflow", function() {
            var instance = new BitLength();
            instance.incByOctets(536870913);
            assert.deepEqual(instance.toUint32Pair(), {"lo": 8, "hi": 1});
        });

        test("should truncate on 64-bit overflow", function() {
            var instance = new BitLength();
            instance.incByOctets(536870913);

            for (var i = 0; i < 512; i++) {
                instance.incByOctets(Math.pow(2, 52));
            }
            assert.deepEqual(instance.toUint32Pair(), {"lo": 8, "hi": 1});
        });
    });

    suite("#copy", function() {
        test("should return a copy with the same initial value", function() {
            var original = new BitLength();
            original.incByOctets(536870913);
            assert.deepEqual(original.copy().toUint32Pair(), {"lo": 8, "hi": 1});
        });

        test("should return a separate instance", function() {
            var original = new BitLength();
            assert.notStrictEqual(original, original.copy());
        });

        test("should return a copy whose value is not mutated by mutating the original", function() {
            var original = new BitLength();
            var copy = original.copy();
            original.incByOctets(536870913);

            assert.deepEqual(original.toUint32Pair(), {"lo": 8, "hi": 1});
            assert.deepEqual(copy.toUint32Pair(), {"lo": 0, "hi": 0});
        });

        test("should return a copy which can be mutated without affecting the original", function() {
            var original = new BitLength();
            var copy = original.copy();
            copy.incByOctets(536870913);

            assert.deepEqual(original.toUint32Pair(), {"lo": 0, "hi": 0});
            assert.deepEqual(copy.toUint32Pair(), {"lo": 8, "hi": 1});
        });
    });
});
