(function(func) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(func);
    } else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = func();
    } else {
        self.MD5 = func();
    }
}(function() {
    "use strict";

    var BitLength = function() {
        this._lo = 0;
        this._hi = 0;
    };

    BitLength.prototype = {
        "incByOctets": function(octetCount) {
            var lo = octetCount & 0x1fffffff;
            var hi = Math.floor((octetCount - lo) / 0x1fffffff) >>> 0;

            lo = (lo << 3) >>> 0;
            lo += this._lo;
            this._lo = lo >>> 0;

            hi += Math.floor((lo - this._lo) / 0x1fffffff);
            hi += this._hi;
            this._hi = hi >>> 0;
        },

        "copy": function() {
            var copy = new BitLength();
            copy._lo = this._lo;
            copy._hi = this._hi;
            return copy;
        },

        "toUint32Pair": function() {
            return {
                "lo": this._lo,
                "hi": this._hi
            };
        }
    };

    var initialState = new Int32Array([
        1732584193,
        -271733879,
        -1732584194,
        271733878
    ]);

    // T[i] = Math.floor(4294967296 * Math.abs(Math.sin(i + 1))) | 0.
    var T = [
        -680876936, -389564586, 606105819, -1044525330,
        -176418897, 1200080426, -1473231341, -45705983,
        1770035416, -1958414417, -42063, -1990404162,
        1804603682, -40341101, -1502002290, 1236535329,
        -165796510, -1069501632, 643717713, -373897302,
        -701558691, 38016083, -660478335, -405537848,
        568446438, -1019803690, -187363961, 1163531501,
        -1444681467, -51403784, 1735328473, -1926607734,
        -378558, -2022574463, 1839030562, -35309556,
        -1530992060, 1272893353, -155497632, -1094730640,
        681279174, -358537222, -722521979, 76029189,
        -640364487, -421815835, 530742520, -995338651,
        -198630844, 1126891415, -1416354905, -57434055,
        1700485571, -1894986606, -1051523, -2054922799,
        1873313359, -30611744, -1560198380, 1309151649,
        -145523070, -1120210379, 718787259, -343485551
    ];

    var fixBlockEndianness = function(buf32) {
        return buf32;
    };
    if (new Uint32Array(new Uint8Array([1, 2, 3, 4]).buffer)[0] === 0x01020304) {
        fixBlockEndianness = function(buf32) {
            for (var i = 0; i < 16; i++) {
                var value = buf32[i];
                buf32[i] = (value << 24) | ((value & 0xff00) << 8) | ((value & 0xff0000) >> 8) | (value >>> 24);
            }
            return buf32;
        };
    }

    var updateBlock = function(state, buf, off) {
        var a = state[0];
        var b = state[1];
        var c = state[2];
        var d = state[3];
        var t = 0;

        // Round1

        t = (((a + (d ^ (b & (c ^ d)))) | 0) + ((T[0] + buf[off + 0]) | 0)) | 0;
        a = (b + ((t << 7) | (t >>> 25))) | 0;
        t = (((d + (c ^ (a & (b ^ c)))) | 0) + ((T[1] + buf[off + 1]) | 0)) | 0;
        d = (a + ((t << 12) | (t >>> 20))) | 0;
        t = (((c + (b ^ (d & (a ^ b)))) | 0) + ((T[2] + buf[off + 2]) | 0)) | 0;
        c = (d + ((t << 17) | (t >>> 15))) | 0;
        t = (((b + (a ^ (c & (d ^ a)))) | 0) + ((T[3] + buf[off + 3]) | 0)) | 0;
        b = (c + ((t << 22) | (t >>> 10))) | 0;

        t = (((a + (d ^ (b & (c ^ d)))) | 0) + ((T[4] + buf[off + 4]) | 0)) | 0;
        a = (b + ((t << 7) | (t >>> 25))) | 0;
        t = (((d + (c ^ (a & (b ^ c)))) | 0) + ((T[5] + buf[off + 5]) | 0)) | 0;
        d = (a + ((t << 12) | (t >>> 20))) | 0;
        t = (((c + (b ^ (d & (a ^ b)))) | 0) + ((T[6] + buf[off + 6]) | 0)) | 0;
        c = (d + ((t << 17) | (t >>> 15))) | 0;
        t = (((b + (a ^ (c & (d ^ a)))) | 0) + ((T[7] + buf[off + 7]) | 0)) | 0;
        b = (c + ((t << 22) | (t >>> 10))) | 0;

        t = (((a + (d ^ (b & (c ^ d)))) | 0) + ((T[8] + buf[off + 8]) | 0)) | 0;
        a = (b + ((t << 7) | (t >>> 25))) | 0;
        t = (((d + (c ^ (a & (b ^ c)))) | 0) + ((T[9] + buf[off + 9]) | 0)) | 0;
        d = (a + ((t << 12) | (t >>> 20))) | 0;
        t = (((c + (b ^ (d & (a ^ b)))) | 0) + ((T[10] + buf[off + 10]) | 0)) | 0;
        c = (d + ((t << 17) | (t >>> 15))) | 0;
        t = (((b + (a ^ (c & (d ^ a)))) | 0) + ((T[11] + buf[off + 11]) | 0)) | 0;
        b = (c + ((t << 22) | (t >>> 10))) | 0;

        t = (((a + (d ^ (b & (c ^ d)))) | 0) + ((T[12] + buf[off + 12]) | 0)) | 0;
        a = (b + ((t << 7) | (t >>> 25))) | 0;
        t = (((d + (c ^ (a & (b ^ c)))) | 0) + ((T[13] + buf[off + 13]) | 0)) | 0;
        d = (a + ((t << 12) | (t >>> 20))) | 0;
        t = (((c + (b ^ (d & (a ^ b)))) | 0) + ((T[14] + buf[off + 14]) | 0)) | 0;
        c = (d + ((t << 17) | (t >>> 15))) | 0;
        t = (((b + (a ^ (c & (d ^ a)))) | 0) + ((T[15] + buf[off + 15]) | 0)) | 0;
        b = (c + ((t << 22) | (t >>> 10))) | 0;

        // Round2

        t = (((a + ((b & d) | (c & ~d))) | 0) + ((T[16] + buf[off + 1]) | 0)) | 0;
        a = (b + ((t << 5) | (t >>> 27))) | 0;
        t = (((d + ((a & c) | (b & ~c))) | 0) + ((T[17] + buf[off + 6]) | 0)) | 0;
        d = (a + ((t << 9) | (t >>> 23))) | 0;
        t = (((c + ((d & b) | (a & ~b))) | 0) + ((T[18] + buf[off + 11]) | 0)) | 0;
        c = (d + ((t << 14) | (t >>> 18))) | 0;
        t = (((b + ((c & a) | (d & ~a))) | 0) + ((T[19] + buf[off + 0]) | 0)) | 0;
        b = (c + ((t << 20) | (t >>> 12))) | 0;

        t = (((a + ((b & d) | (c & ~d))) | 0) + ((T[20] + buf[off + 5]) | 0)) | 0;
        a = (b + ((t << 5) | (t >>> 27))) | 0;
        t = (((d + ((a & c) | (b & ~c))) | 0) + ((T[21] + buf[off + 10]) | 0)) | 0;
        d = (a + ((t << 9) | (t >>> 23))) | 0;
        t = (((c + ((d & b) | (a & ~b))) | 0) + ((T[22] + buf[off + 15]) | 0)) | 0;
        c = (d + ((t << 14) | (t >>> 18))) | 0;
        t = (((b + ((c & a) | (d & ~a))) | 0) + ((T[23] + buf[off + 4]) | 0)) | 0;
        b = (c + ((t << 20) | (t >>> 12))) | 0;

        t = (((a + ((b & d) | (c & ~d))) | 0) + ((T[24] + buf[off + 9]) | 0)) | 0;
        a = (b + ((t << 5) | (t >>> 27))) | 0;
        t = (((d + ((a & c) | (b & ~c))) | 0) + ((T[25] + buf[off + 14]) | 0)) | 0;
        d = (a + ((t << 9) | (t >>> 23))) | 0;
        t = (((c + ((d & b) | (a & ~b))) | 0) + ((T[26] + buf[off + 3]) | 0)) | 0;
        c = (d + ((t << 14) | (t >>> 18))) | 0;
        t = (((b + ((c & a) | (d & ~a))) | 0) + ((T[27] + buf[off + 8]) | 0)) | 0;
        b = (c + ((t << 20) | (t >>> 12))) | 0;

        t = (((a + ((b & d) | (c & ~d))) | 0) + ((T[28] + buf[off + 13]) | 0)) | 0;
        a = (b + ((t << 5) | (t >>> 27))) | 0;
        t = (((d + ((a & c) | (b & ~c))) | 0) + ((T[29] + buf[off + 2]) | 0)) | 0;
        d = (a + ((t << 9) | (t >>> 23))) | 0;
        t = (((c + ((d & b) | (a & ~b))) | 0) + ((T[30] + buf[off + 7]) | 0)) | 0;
        c = (d + ((t << 14) | (t >>> 18))) | 0;
        t = (((b + ((c & a) | (d & ~a))) | 0) + ((T[31] + buf[off + 12]) | 0)) | 0;
        b = (c + ((t << 20) | (t >>> 12))) | 0;

        // Round3

        t = (((a + (b ^ c ^ d)) | 0) + ((T[32] + buf[off + 5]) | 0)) | 0;
        a = (b + ((t << 4) | (t >>> 28))) | 0;
        t = (((d + (a ^ b ^ c)) | 0) + ((T[33] + buf[off + 8]) | 0)) | 0;
        d = (a + ((t << 11) | (t >>> 21))) | 0;
        t = (((c + (d ^ a ^ b)) | 0) + ((T[34] + buf[off + 11]) | 0)) | 0;
        c = (d + ((t << 16) | (t >>> 16))) | 0;
        t = (((b + (c ^ d ^ a)) | 0) + ((T[35] + buf[off + 14]) | 0)) | 0;
        b = (c + ((t << 23) | (t >>> 9))) | 0;

        t = (((a + (b ^ c ^ d)) | 0) + ((T[36] + buf[off + 1]) | 0)) | 0;
        a = (b + ((t << 4) | (t >>> 28))) | 0;
        t = (((d + (a ^ b ^ c)) | 0) + ((T[37] + buf[off + 4]) | 0)) | 0;
        d = (a + ((t << 11) | (t >>> 21))) | 0;
        t = (((c + (d ^ a ^ b)) | 0) + ((T[38] + buf[off + 7]) | 0)) | 0;
        c = (d + ((t << 16) | (t >>> 16))) | 0;
        t = (((b + (c ^ d ^ a)) | 0) + ((T[39] + buf[off + 10]) | 0)) | 0;
        b = (c + ((t << 23) | (t >>> 9))) | 0;

        t = (((a + (b ^ c ^ d)) | 0) + ((T[40] + buf[off + 13]) | 0)) | 0;
        a = (b + ((t << 4) | (t >>> 28))) | 0;
        t = (((d + (a ^ b ^ c)) | 0) + ((T[41] + buf[off + 0]) | 0)) | 0;
        d = (a + ((t << 11) | (t >>> 21))) | 0;
        t = (((c + (d ^ a ^ b)) | 0) + ((T[42] + buf[off + 3]) | 0)) | 0;
        c = (d + ((t << 16) | (t >>> 16))) | 0;
        t = (((b + (c ^ d ^ a)) | 0) + ((T[43] + buf[off + 6]) | 0)) | 0;
        b = (c + ((t << 23) | (t >>> 9))) | 0;

        t = (((a + (b ^ c ^ d)) | 0) + ((T[44] + buf[off + 9]) | 0)) | 0;
        a = (b + ((t << 4) | (t >>> 28))) | 0;
        t = (((d + (a ^ b ^ c)) | 0) + ((T[45] + buf[off + 12]) | 0)) | 0;
        d = (a + ((t << 11) | (t >>> 21))) | 0;
        t = (((c + (d ^ a ^ b)) | 0) + ((T[46] + buf[off + 15]) | 0)) | 0;
        c = (d + ((t << 16) | (t >>> 16))) | 0;
        t = (((b + (c ^ d ^ a)) | 0) + ((T[47] + buf[off + 2]) | 0)) | 0;
        b = (c + ((t << 23) | (t >>> 9))) | 0;

        // Round4

        t = ((a + (c ^ (b | ~d))) | 0) + ((T[48] + buf[off + 0]) | 0) | 0;
        a = (b + ((t << 6) | (t >>> 26))) | 0;
        t = ((d + (b ^ (a | ~c))) | 0) + ((T[49] + buf[off + 7]) | 0) | 0;
        d = (a + ((t << 10) | (t >>> 22))) | 0;
        t = ((c + (a ^ (d | ~b))) | 0) + ((T[50] + buf[off + 14]) | 0) | 0;
        c = (d + ((t << 15) | (t >>> 17))) | 0;
        t = ((b + (d ^ (c | ~a))) | 0) + ((T[51] + buf[off + 5]) | 0) | 0;
        b = (c + ((t << 21) | (t >>> 11))) | 0;

        t = ((a + (c ^ (b | ~d))) | 0) + ((T[52] + buf[off + 12]) | 0) | 0;
        a = (b + ((t << 6) | (t >>> 26))) | 0;
        t = ((d + (b ^ (a | ~c))) | 0) + ((T[53] + buf[off + 3]) | 0) | 0;
        d = (a + ((t << 10) | (t >>> 22))) | 0;
        t = ((c + (a ^ (d | ~b))) | 0) + ((T[54] + buf[off + 10]) | 0) | 0;
        c = (d + ((t << 15) | (t >>> 17))) | 0;
        t = ((b + (d ^ (c | ~a))) | 0) + ((T[55] + buf[off + 1]) | 0) | 0;
        b = (c + ((t << 21) | (t >>> 11))) | 0;

        t = ((a + (c ^ (b | ~d))) | 0) + ((T[56] + buf[off + 8]) | 0) | 0;
        a = (b + ((t << 6) | (t >>> 26))) | 0;
        t = ((d + (b ^ (a | ~c))) | 0) + ((T[57] + buf[off + 15]) | 0) | 0;
        d = (a + ((t << 10) | (t >>> 22))) | 0;
        t = ((c + (a ^ (d | ~b))) | 0) + ((T[58] + buf[off + 6]) | 0) | 0;
        c = (d + ((t << 15) | (t >>> 17))) | 0;
        t = ((b + (d ^ (c | ~a))) | 0) + ((T[59] + buf[off + 13]) | 0) | 0;
        b = (c + ((t << 21) | (t >>> 11))) | 0;

        t = ((a + (c ^ (b | ~d))) | 0) + ((T[60] + buf[off + 4]) | 0) | 0;
        a = (b + ((t << 6) | (t >>> 26))) | 0;
        t = ((d + (b ^ (a | ~c))) | 0) + ((T[61] + buf[off + 11]) | 0) | 0;
        d = (a + ((t << 10) | (t >>> 22))) | 0;
        t = ((c + (a ^ (d | ~b))) | 0) + ((T[62] + buf[off + 2]) | 0) | 0;
        c = (d + ((t << 15) | (t >>> 17))) | 0;
        t = ((b + (d ^ (c | ~a))) | 0) + ((T[63] + buf[off + 9]) | 0) | 0;
        b = (c + ((t << 21) | (t >>> 11))) | 0;

        state[0] += a;
        state[1] += b;
        state[2] += c;
        state[3] += d;
    };

    var set = function(dst, dstOffset, dstLength, src, srcOffset, srcLength) {
        var dstAvailable = dstLength - dstOffset;
        var srcAvailable = srcLength - srcOffset;
        var length = dstAvailable < srcAvailable ? dstAvailable : srcAvailable;
        dst.set(src.subarray(srcOffset, srcOffset + length), dstOffset);
        return length;
    };

    var update = function(state, data, buffer, _bufferOffset, buffer32) {
        var dataOffset = 0;
        var dataLength = data.length;
        var bufferOffset = _bufferOffset;
        var bufferLength = buffer.length;

        while (dataOffset < dataLength) {
            var length = set(buffer, bufferOffset, bufferLength, data, dataOffset, dataLength);

            var start = bufferOffset - bufferOffset % 64;
            var end = bufferOffset + length;
            end -= end % 64;
            for (var i = start; i < end; i += 64) {
                updateBlock(state, fixBlockEndianness(buffer32), i / 4);
            }

            bufferOffset += length;
            dataOffset += length;

            if (bufferOffset === bufferLength) {
                bufferOffset = 0;
            }
        }
        return bufferOffset;
    };

    var stateToArrayBuffer = function(state) {
        var result = new DataView(new ArrayBuffer(16));
        for (var i = 0, len = state.length; i < len; i++) {
            result.setInt32(i * 4, state[i], true);
        }
        return result.buffer;
    };

    var MD5 = function(data) {
        this._state = new Int32Array(initialState);
        this._bitLength = new BitLength();

        this._buffer8 = new Uint8Array(4096);
        this._buffer32 = new Int32Array(this._buffer8.buffer);
        this._offset = 0;

        if (data !== void 0) {
            this.update(data);
        }
    };

    MD5.prototype = {
        "update": function(_data) {
            var data = null;
            if (_data instanceof Uint8Array) {
                data = _data;
            } else if (_data instanceof ArrayBuffer) {
                data = new Uint8Array(_data);
            } else {
                throw new TypeError("Expected Uint8Array or ArrayBuffer");
            }

            this._offset = update(this._state, data, this._buffer8, this._offset, this._buffer32);
            this._bitLength.incByOctets(data.length);
        },

        "digest": function() {
            var blockOffset = this._offset % 64;
            var paddingSize = 56 - blockOffset;
            if (paddingSize <= 0) {
                paddingSize = 64 + paddingSize;
            }

            var tail = new Uint8Array(paddingSize + 8);
            var tailView = new DataView(tail.buffer);
            tail[0] = 0x80;

            var bitLength = this._bitLength.toUint32Pair();
            tailView.setUint32(paddingSize, bitLength.lo, true);
            tailView.setUint32(paddingSize + 4, bitLength.hi, true);

            var state = new Int32Array(this._state);
            var buffer8 = new Uint8Array(this._buffer8);
            update(state, tail, buffer8, this._offset, new Int32Array(buffer8.buffer));

            return stateToArrayBuffer(state);
        },

        "hexDigest": function() {
            var bytes = new Uint8Array(this.digest());

            var result = "";
            for (var i = 0, len = bytes.length; i < len; i++) {
                result += (bytes[i] >>> 4).toString(16);
                result += (bytes[i] & 0xf).toString(16);
            }
            return result;
        },

        "copy": function() {
            var copy = new MD5();
            copy._bitLength = this._bitLength.copy();
            copy._state.set(this._state);
            copy._offset = this._offset;
            copy._buffer8.set(this._buffer8);
            return copy;
        }
    };

    MD5._BitLength = BitLength;

    return MD5;
}));
