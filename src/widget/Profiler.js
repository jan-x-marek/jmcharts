import Box from './Box'

export default class Profiler extends Box {

  constructor() {
    super()
    this.height(15)
    this.class('jmc-status-bar')
  }

  setRoot(root) {
    this.root = root
  }

  update(layout) {
    const domainSize = this.root._getMasterSeries().length()
    const elapsedTime = new Date().getTime() - this.root.updateStartTimestamp
    this.div.text(`domain size: ${domainSize}, update duration: ${elapsedTime} ms`)
  }
}
