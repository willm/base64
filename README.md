# Base 64

This is an implementation of the base64 part of [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648)
in node js. It is intended purely for educational purposes.

If you're looking for a way to encode data into base 64 using node, you should
completely ignore this project and use something like this.

```javascript
Buffer.from('abc').toString('base64');
```

and likewise to decode a base64 string.

```javascript
Buffer.from('aGVsbG8K', 'base64').toString('utf8')
```

However if you're interested in how you might implement base64 in javascript,
this project may be interesting to you.

## Usage

### Encoding

The program reads from stdin and outputs the base64 encoded version to stdout.
you can run it like this.

```bash
printf hello | ./index.js
# outputs -> aGVsbG8K
```

### Decoding

Adding the `--decode` flag changes the program to expect a base64 encoded
string via stdin and prints the decoded version to stdout.


```bash
printf aGVsbG8K | ./index.js
# outputs -> hello
```
