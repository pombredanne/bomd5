var assert = require("assert");
var MD5 = require("../lib/MD5");

suite("RFC 1321 section 3.1", function() {
    "use strict";

    test("padding should be performed even when the message byte length ≡ 56 (mod 64)", function() {
        var md5 = new MD5();
        md5.update(new Uint8Array(56));
        assert.strictEqual(md5.hexDigest(), "e3c4dd21a9171fd39d208efa09bf7883");
    });

    suite("(regression test) padding length calculations", function() {
        test("should survive when input bit byte length > 64 and ≡ 63 (mod 64)", function() {
            var md5 = new MD5(new Uint8Array(127));
            assert.strictEqual(md5.hexDigest(), "e457fbae1dd166a0c89d244ac03f4e93");
        });

        test("should survive when input bit length > 64 and ≡ 0 (mod 64)", function() {
            var md5 = new MD5(new Uint8Array(128));
            assert.strictEqual(md5.hexDigest(), "f09f35a5637839458e462e6350ecbce4");
        });

        test("should survive when input bit length > 64 and ≡ 1 (mod 64)", function() {
            var md5 = new MD5(new Uint8Array(129));
            assert.strictEqual(md5.hexDigest(), "5f54d1240735d46980b776af554f44d3");
        });
    });
});

suite("RFC 1321 section A.5", function() {
    "use strict";

    // Original tests from RFC 1321 section A.5 (Test suite).

    var stringToArrayBuffer = function(string) {
        var array = new Uint8Array(string.length);
        for (var i = 0; i < string.length; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    };

    var md5Case = function(input, output) {
        test("MD5 (" + JSON.stringify(input) + ") = " + output, function() {
            var md5 = new MD5(stringToArrayBuffer(input));
            assert.strictEqual(md5.hexDigest(), output);
        });
    };

    md5Case("", "d41d8cd98f00b204e9800998ecf8427e");
    md5Case("a", "0cc175b9c0f1b6a831c399e269772661");
    md5Case("abc", "900150983cd24fb0d6963f7d28e17f72");
    md5Case("message digest", "f96b697d7cb7938d525a2f31aaf161d0");
    md5Case("abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b");
    md5Case("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "d174ab98d277d9f5a5611c2c9f419d9f");
    md5Case("12345678901234567890123456789012345678901234567890123456789012345678901234567890", "57edf4a22be3c955ac49da2e2107b67a");
});
