/**
 * This is assigned to IO target via `[Element].render`.
 * @param {_competent.RenderMeta} meta
 * @param {function(new:_competent.PlainComponent)} Comp
 * @param {_competent.PlainComponent} comp Already rendered component.
 */
module.exports = function startPlain(meta, Comp, comp, el, parent, props, children) {
  if (!comp) comp = new Comp(el, parent)
  const r = () => {
    comp.render({ ...props, children })
    meta.instance = comp
  }
  if (Comp.load) { // &!comp
    Comp.load((err, data) => {
      if (data) Object.assign(props, data)
      if (!err) r()
      else console.warn(err)
    }, el, props)
  } else r()
  return comp
}

/**
 * @typedef {import('../..').RenderMeta} _competent.RenderMeta
 * @typedef {import('../..').PlainComponent} _competent.PlainComponent
 */