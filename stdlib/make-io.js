module.exports = function makeIo(options = {}) {
  const { rootMargin = '76px', log = true, ...rest } = options
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (target.render) {
          if (log) console.warn('Rendering component %s into the element %s ',
            target.render.meta.key, target.render.meta.id)
          target.render()
          io.unobserve(target)
        }
      }
    })
  }, { rootMargin, ...rest })
  return io
}