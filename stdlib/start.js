const PreactProxy = require('./preact-proxy')

/**
 * @param {_competent.RenderMeta} meta
 * @param {function(new:_competent.PlainComponent)|function(new:_competent.CompetentComponent)} Comp
 * @param {_competent.PlainComponent} comp Already rendered plain component.
 * @param {Element} el The element in which to render.
 * @param {Element} parent The parent element for rendering.
 */
module.exports = function start(meta, Comp, comp, el, parent, props, children, preact) {
  const isPlain = meta.plain
  if (!comp && isPlain) {
    comp = new Comp(el, parent)
  } else if (!comp) {
    comp = new PreactProxy(el, parent, Comp, preact)
  }
  const r = () => {
    comp.render({ ...props, children })
    meta.instance = comp
  }
  if (Comp.load) {
    Comp.load((err, data) => {
      if (data) Object.assign(props, data)
      if (!err) r()
      else console.warn(err)
    }, el, props)
  } else r()
  return comp
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').RenderMeta} _competent.RenderMeta
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').CompetentComponent} _competent.CompetentComponent
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').PlainComponent} _competent.PlainComponent
 */