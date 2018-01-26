import RendererBase from './renderer/RendererBase'
import BarRenderer from './renderer/BarRenderer'
import LineRenderer from './renderer/LineRenderer'
import OhlcRenderer from './renderer/OhlcRenderer'
import ShapeRenderer from './renderer/ShapeRenderer'
import {exports as renderer_ctx_exports} from './renderer/ContextInfo'
import {exports as renderer_shapes_exports} from './renderer/Shapes'

import Box from './widget/Box'
import Chart from './widget/Chart'
import ControlPanel from './widget/ControlPanel'
import CurrentValues from './widget/CurrentValues'
import DateAxis from './widget/DateAxis'
import Label from './widget/Label'
import Profiler from './widget/Profiler'
import Slider from './widget/Slider'
import Tooltip from './widget/Tooltip'
import VBox from './widget/VBox'

import {exports as series_exports} from './util/Series'

import Root from './Root'

export const jmcharts = {

  renderer: {
    Base: RendererBase,
    Bar: BarRenderer,
    bar: s => new BarRenderer(s),
    Line: LineRenderer,
    line: s => new LineRenderer(s),
    OHLC: OhlcRenderer,
    ohlc: s => new OhlcRenderer(s),
    Shape: ShapeRenderer,
    shape:  s => new ShapeRenderer(s),
    ctx: renderer_ctx_exports,
    shapes: renderer_shapes_exports,
  },

  widget: {
    Box: Box,
    box: () => new Box(),
    Chart: Chart,
    chart: () => new Chart(),
    ControlPanel: ControlPanel,
    controlPanel: () => new ControlPanel(),
    CurrentValues: CurrentValues,
    currentValues: () => new CurrentValues(),
    DateAxis:  DateAxis,
    dateAxis: () => new DateAxis(),
    Label: Label,
    label: () => new Label(),
    Profiler: Profiler,
    profiler: () => new Profiler(),
    Tooltip: Tooltip,
    tooltip: () => new Tooltip(),
    VBox: VBox,
    vbox: () => new VBox(),
  },

  series: series_exports,

  Root: Root,
  root: parentId => new Root(parentId),
}
