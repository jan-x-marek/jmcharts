import Box from './Box'
import Slider from './Slider'

export default class ControlPanel extends Box {

  constructor() {
    super()
    this.height(25)
  }

  setRoot(root) {
    this.root = root
  }

  init(parentSvg, parentDiv, layout) {

    super.init(parentSvg, parentDiv, layout)

    this.div.append('div')
      .text('=')
      .attr('class', 'jmc-slider-button')
      .style('margin', '0px 0px 0px 10px')
      .style('float', 'left')
      .on('click', () => this.root.zoom(5))

    this.div.append('div')
      .text('-')
      .attr('class', 'jmc-slider-button')
      .style('margin', '0px 0px 0px 5px')
      .style('float', 'left')
      .on('click', () => this.root.zoom(1.5))

    const lastButton = this.div.append('div')
      .text('+')
      .attr('class', 'jmc-slider-button')
      .style('margin', '0px 5px 0px 5px')
      .style('float', 'left')
      .on('click', () => this.root.zoom(0.66))

    const dn = this.div.node()
    const lbn = lastButton.node()
    const occupiedSpace = Math.round(100 * (lbn.offsetWidth + lbn.offsetLeft) / dn.offsetWidth)
    const sliderWidth = (100-occupiedSpace)*0.9
    const sliderDiv = this.div.append('div').style('width', `${sliderWidth}%`)

    this.slider = new Slider(this.root, sliderDiv)
  }

  update(layout) {
    this.slider.update()
  }
}
