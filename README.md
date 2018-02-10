# jmcharts

Javascript charting library. Ultrafast, memory-efficient, simple.

<h4>See an interactive demo <a href="https://jan-x-marek.github.io/jmcharts/">HERE</a></h4>

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

## Quick example









