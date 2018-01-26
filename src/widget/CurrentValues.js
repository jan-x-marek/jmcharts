import * as ou from '../util/ObjectUtil'
import Box from './Box'

export default class CurrentValues extends Box {

  constructor() {
    super()
    this.height(30)
    this.class('jmc-status-bar')
  }

  setRoot(root) {
    this.root = root
  }

  updateContextInfo(source, info) {

    const content = info
      .filter(o => o.topic === 'currentValue')
      .map(o => o.value)
      .map(o => ou.toString(o))
      .map(o => o.replace(/["'{}()]/g, ''))
      .join(', ')

    this.div.text(content)
  }
}
