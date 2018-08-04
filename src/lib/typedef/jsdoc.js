const jsDocRe = / * @param {(.+?)} \[?([^\s\]]+)\]?(?: .+)?((?:\n \* @param {(?:.+?)} \[?\2\]?.*)*)/gm

export { jsDocRe }