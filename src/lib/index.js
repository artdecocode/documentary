// koa2jsxreducer-functionview-containeractions-objectstatic-boolean--truerender-function-function
// koa2jsxbrnbspnbspreducer-functionbrnbspnbspview-containerbrnbspnbspactions-objectbrnbspnbspstatic-boolean--truebrnbspnbsprender-functionbr-function
//        brnbspnbsp                brnbspnbsp              brnbspnbsp              brnbspnbsp                    brnbspnbsp               br
export const getLink = (title) => {
  const l = title
    .replace(/<br\/>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/[^\w-\d ]/g, '')
    .toLowerCase()
    .replace(/[, ]/g, '-')
  return l
}
