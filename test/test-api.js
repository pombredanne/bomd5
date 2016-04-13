var assert = require("assert");
var MD5 = require("../lib/MD5");

suite("new MD5(data)", function() {
    "use strict";

    test("should accept ArrayBuffer data", function() {
        var md5 = new MD5(new Uint8Array([0, 0]).buffer);
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });

    test("should accept Uint8Array data", function() {
        var md5 = new MD5(new Uint8Array([0, 0]));
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });

    test("should throw a TypeError when data is not undefined and not of type Uint8Array or ArrayBuffer", function() {
        assert.throws(function() {
            return new MD5("test");
        }, TypeError);
    });

    test("should accept 0-length data", function() {
        assert.doesNotThrow(function() {
            return new MD5(new Uint8Array(0));
        });
    });
});

suite("MD5#update(data)", function() {
    "use strict";

    test("should accept ArrayBuffer data", function() {
        var md5 = new MD5();
        md5.update(new Uint8Array([0, 0]).buffer);
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });

    test("should accept Uint8Array data", function() {
        var md5 = new MD5();
        md5.update(new Uint8Array([0, 0]));
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });

    test("should make the same state changes regardless of in how many pieces the data has been fed in", function() {
        var md5 = new MD5();
        md5.update(new Uint8Array([0]));
        md5.update(new Uint8Array([0]));
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });

    test("should throw a TypeError when data is not of type Uint8Array or ArrayBuffer", function() {
        var md5 = new MD5();
        assert.throws(function() {
            md5.update("test");
        }, TypeError);
    });

    test("should accept 0-length data", function() {
        var md5 = new MD5();
        assert.doesNotThrow(function() {
            md5.update(new Uint8Array(0));
        });
    });
});

suite("MD5#digest()", function() {
    "use strict";

    var equals = function(arrayBuffer, octets) {
        var array = new Uint8Array(arrayBuffer);
        if (array.length !== octets.length) {
            return false;
        }

        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] !== octets[i]) {
                return false;
            }
        }
        return true;
    };

    test("should return an ArrayBuffer instance", function() {
        var md5 = new MD5();
        assert(md5.digest() instanceof ArrayBuffer);
    });

    test("should return the digest as raw octets", function() {
        var md5 = new MD5();
        assert(equals(md5.digest(), [212, 29, 140, 217, 143, 0, 178, 4, 233, 128, 9, 152, 236, 248, 66, 126]));
    });

    test("should not modify the internal state", function() {
        var md5 = new MD5();
        assert(equals(md5.digest(), [212, 29, 140, 217, 143, 0, 178, 4, 233, 128, 9, 152, 236, 248, 66, 126]));
        md5.update(new Uint8Array([0, 0]));
        assert(equals(md5.digest(), [196, 16, 63, 18, 45, 39, 103, 124, 157, 177, 68, 202, 225, 57, 74, 102]));
    });
});

suite("MD5#hexDigest()", function() {
    "use strict";

    test("should return a string", function() {
        var md5 = new MD5();
        assert.strictEqual(typeof md5.hexDigest(), "string");
    });

    test("should not modify the internal state", function() {
        var md5 = new MD5();
        assert.strictEqual(md5.hexDigest(), "d41d8cd98f00b204e9800998ecf8427e");
        md5.update(new Uint8Array([0, 0]));
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });
});

suite("MD5#copy()", function() {
    "use strict";

    test("should return a copy with the same initial value", function() {
        var md5 = new MD5(new Uint8Array([0, 0]));
        assert.strictEqual(md5.copy().hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });

    test("should return a new instance", function() {
        var md5 = new MD5();
        assert.notStrictEqual(md5, md5.copy());
    });

    test("should return a copy whose value is not mutated by mutating the original", function() {
        var md5 = new MD5();
        var copy = md5.copy();
        md5.update(new Uint8Array([0, 0]));
        assert.strictEqual(md5.hexDigest(), "c4103f122d27677c9db144cae1394a66");
        assert.strictEqual(copy.hexDigest(), "d41d8cd98f00b204e9800998ecf8427e");
    });

    test("should return a copy which can be mutated without affecting the original", function() {
        var md5 = new MD5();
        var copy = md5.copy();
        copy.update(new Uint8Array([0, 0]));
        assert.strictEqual(md5.hexDigest(), "d41d8cd98f00b204e9800998ecf8427e");
        assert.strictEqual(copy.hexDigest(), "c4103f122d27677c9db144cae1394a66");
    });
});
