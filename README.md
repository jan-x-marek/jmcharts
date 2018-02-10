# jmcharts

Javascript charting library. Ultrafast, memory-efficient, simple.

#### See an interactive demo [HERE](https://jan-x-marek.github.io/jmcharts/)

## The Usecase

There are some excellent free charting libraries, why to make another one?

My usecase is a bit unusual. Rather than drawing a simple chart with a few dozen data points on a public webpage, I need a full-blown replacement of my fat native charting tool. I need to display many charts at a time, feed them with a lot of data, be able to scroll and zoom in and out quickly. And I do not mind pre-loading large datasets in advance. None of the free libraries that I experimented with satisfied my needs, so I decided to implement it on my own and share it here.

## Features
* Time series charting - OHLC, line, bar, custom shapes.
* Multiple series in a single box, optional multiple y-axes.
* Several chart boxes sharing the same x-axis.
* Interactive scrolling, zooming, tooltips
* Easy to extend - adding custom widgets, data renderers, etc.
* Nice fluent API

## Install
``npm install jmcharts``

## Quick example

```javascript
import {jmcharts as c} from 'jmcharts'

//Create the root chart container. It will be placed in a div with id 'chart' in the current document.
const root = c.root('chart')
  .width(600)
  .height(400)

const x = [1000,2000,5000,...]  //x-axis points
const y1 = [42,32,40,...]       //y-points
const y2 = [24,23,33,...]       //another y-points

//Series is just a wrapper of x and y with some utility methods for data access
const series1 = c.series.series(x,y1)
const series2 = c.series.series(x,y2)

//Add a chart box into the root container
const chart = root.append(c.widget.chart())
  .height(300)

//Draw series1 as a line
chart.appendRenderer(c.renderer.line(series1))
  .color('blue')

//Draw series2 as triangles with a custom tooltip
chart.appendRenderer(c.renderer.shape(series2))
  .color('#777')
  .shape(c.renderer.shapes.equilateralTriangleUp(20))
  .fill(true)
  .addTooltipSupplier(i => `<h2>My tooltip</h2>`)

//Render x-axis as dates
root.append(c.widget.dateAxis())

//Add scrollbar and navigation buttons
root.append(c.widget.controlPanel())

//Enable tooltips
root.append(c.widget.tooltip())

//And finally render the chart
root.init()
root.update()
```

For a bit more complex example, see [the demo](https://jan-x-marek.github.io/jmcharts/) and [its source](https://github.com/jan-x-marek/jmcharts/blob/master/demo/src/demoNice.js) 
