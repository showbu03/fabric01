// random string of x length
function randStr(length) {
  let text = '';
  const possible = 'abcdefghijkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
module.exports.randStr = randStr;

// left pad string with "0"s
function leftPad(str, length) {
  for (let i = str.length; i < length; i += 1) str = `0${String(str)}`;
  return str;
}
module.exports.leftPad = leftPad;
