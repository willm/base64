# Base 64

This is an implementation of the base64 part of [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648)
in node js. It is intended purely for educational purposes. If you're looking
for a way to encode data into base 64 using node, you should completely ignore
this project and use something like this.

```javascript
Buffer.from('abc').toString('base64');
```

## Usage

The program reads from stdin and outputs the base64 encoded version to stdout.
you can run it like this.

```bash
printf hello | ./index.js
```
