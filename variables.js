function newVar(str) {
  return '\\$\\(' + str + '\\)';
  // return '$(' + str + ')';
}

exports.vars = {
  count: newVar('count'),
  userVar: newVar('user'),
};
