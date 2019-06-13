const minimatch = require('minimatch')
const loaderUtils = require('loader-utils')
const path = require('path')
const fs = require('fs')

function isArray (variable) {
  return variable instanceof Array
}

function isObject (variable) {
  return typeof variable === 'object' && !isArray(variable)
}

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable()
  }

  const options = loaderUtils.getOptions(this)
  const template = options.template
  if (template === undefined) return source
  const includes = options.includes || []
  const symbols = options.symbols || {}
  symbols.source = options.source || source
  const absolutePath = this.resourcePath
  const relativePath = path.relative(this.rootContext, absolutePath)
  if (minimatch(relativePath, '*.js')) {
    source = template.replace('$_source', source)
  }
  includes.forEach(include => {
    if (minimatch(relativePath, include) || minimatch(absolutePath, include)) {
      let reArr = []
      Object.keys(symbols).forEach(symbol => {
        const symbolValue = symbols[symbol]
        reArr.push(`(\\$_${symbol})`)
        if (isObject(symbolValue)) {
          let path = symbolValue.path
          symbols[symbol] = fs.readFileSync(path).toString()
        }
      })
      let re = new RegExp(reArr.join('|'), 'g')
      source = template.replace(re, match => {
        return symbols[match.substr(2)]
      })
    }
  })

  return source
}
