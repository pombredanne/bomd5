# bomd5

A dependency-free incremental MD5 hashing library for modern(ish) browsers.

Main goals of bomd5 are:

 * **Correctness**, even for unbounded inputs and for both little-endian and big-endian environments.
 * **Incremental hashing**. We want to be able to hash large amounts of data without needing to keep all of it in memory at once.
 * **ArrayBuffer and Uint8Array** input support. This allows bomd5 to work well together with other APIs such as [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) and [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder).
 * **Good performance** in most common browser environments, reasonably fast for others. See a performance comparison against other fine incremental ArrayBuffer/Uint8Array MD5 hashers at [jsperf.com](http://jsperf.com/incremental-md5-arraybuffers-shootout/4).
 * **Minimal dependencies** - preferably none - for easier inclusion to browser environments. Currently bomd5 doesn't have any external dependencies.

## Installation

```
npm install bomd5
```

## Example

```javascript
var MD5 = require("bomd5");
var data = new Uint8Array(1024 * 1024);

// Accept (optional) initial input
var md5 = new MD5(data);

for (var i = 0; i < 100; i++) {
    // Allow incremental hashing
    md5.update(data);
}

// Console output: 7092f29539399585b4ca1f33a2a432fe
console.log(md5.hexDigest());
```

## References

The code is based on [RFC 1321](https://www.ietf.org/rfc/rfc1321.txt) and [the Wikipedia article on MD5](http://en.wikipedia.org/wiki/MD5).
