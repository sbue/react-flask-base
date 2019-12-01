import _ from 'lodash'

// TODO: delete this file

export function camelToSnake(key) {
  return key.replace( /([A-Z])/g, " $1" ).split(' ').join('_').toLowerCase();
}

export function snakeToCamel(key) {
  return key.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {object} obj   The object we want to transform
 *
 * @return {object}       The transformed object
 */
export function objSnakeToCamel(obj) {
  console.log(obj);
  const x = _.mapKeys(obj, ( value, key ) => {
    return snakeToCamel(key);
  });
  console.log(x);
  return Object(x);
}
