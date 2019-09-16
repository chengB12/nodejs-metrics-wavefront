'use strict';

const tagSeparator = "-tags=";

function tagger(tags, globaltags) {
  // return tags in the format 'env="prod" service="qa"'
  // Also merges the global tags with metric tags
  let mergedTags = Object.assign({}, globaltags, tags);
  return Object.keys(mergedTags).map(
    key => `${key}="${escapeQuotes(mergedTags[key])}"`).join(' ');
}

function escapeQuotes(str) {
  return str.replace(/\"/g, "\\\"");
}

function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function encodeKey(metricName, tags) {
  if (isEmpty(tags)) {
    return metricName;
  }

  var tagsType = Object.prototype.toString.call(tags).slice(8, -1);
  if (tagsType === "Object") {
    // Sort the tags based on their keys to ensure we don't duplicate metrics if the same tags come out of order.
    var tagsArray = Object.keys(tags).sort().map(key => [key, tags[key]]);
    return metricName + tagSeparator + JSON.stringify(tagsArray) ;
  }
  throw new Error("Wrong Tags datatype sent to the API. Expected: Object. Actual: " + tagsType);
}

function decodeKey(key) {
  var [metricName, tags] = [key, null];
  if (key.indexOf(tagSeparator) > -1) {
    [metricName, tags] = key.split(tagSeparator);
  }
  return [metricName, tags];
}

module.exports = {
  tagger,
  escapeQuotes,
  isEmpty,
  encodeKey,
  decodeKey
};
