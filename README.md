# hummingbird-popover

A tiny and fast jQuery plugin for multi-layer popovers

#### [Visit demo page ](https://hummingbird-dev.000webhostapp.com/hummingbird-popover)

## Features

- Opens popover menues on right mouse click.
- Based on simple HTML lists.
- Can be attached to any HTML element.
- Supports multiple layer menues.
- Supports multiple popover's on one page.


## Dependencies

- bootstrap v3.3.7
- jQuery v3.1.1 
- font-awesome v4.7.0 

The hummingbird-popover is tested with these versions, newer versions work most probably as well.

## Example 

![alt text](./popover_example_anim.gif "hummingbird-popover example animation")


## Getting started
### Usage

Add the following resources for the hummingbird-popover to function correctly:

```html
	
    <!-- Required Stylesheets -->
    <link href="/path/to/bootstrap.css" rel="stylesheet">
    <link href="/path/to/font-awesome.css" rel="stylesheet">
    <link href="/path/to/hummingbird-popover.css" rel="stylesheet">

    <!-- Required Javascript -->
    <script src="/path/to/jquery.js"></script>
    <script src="/path/to/bootstrap.js"></script>
    <script src="/path/to/hummingbird-popover.js"></script>

```

Create an HTML element as bindpoint for the popover, e.g. an
`<h1>`. The *id* and *data-id* can be chosen
arbitrarily. However, it is important that the *data-id* of the bindpoint and the
*id* of the popover "structure", i.e. the list containing the
popover content, are **equal**.

``` html

<h1 id="theText" data-id="changeText">Click this text with the right mousebutton. 
A popover will appear to change text, color or font.</h1>

```

Create a simple structure for the popover content. The class must be
*hummingbird-popover-converter* and the *id* must be
**equal** to the *data-id* of the bindpoint (see above). The
hyphens indicate the level and the belonging of the popover
items. This means that items of one popover can have a popover by
themselves. In the example the base popover contains *Change
text*, *Change color* and *Change font*.  The *Change
color* has again a popover containing *Red colors* and *Blue
colors*, etc.

``` html

<div class="hummingbird-popover-converter" id="changeText">
<li>Change text</li>
<li>Change color</li>
<li>-Red colors</li>
<li>--DarkRed</li>
<li>--Red</li>
<li>--OrangeRed</li>
<li>-Blue colors</li>
<li>--MidnightBlue</li>
<li>--Blue</li>
<li>--LightSkyBlue</li>
<li>Change font</li>
<li>-bold</li>
<li>-normal</li>
<li>-lighter</li>
</div>

```

Initialize hummingbird-popover:

``` javascript

$("#theText").hummingbirdPopover();

```

Congratulations, you are done, your HTML element has now right mouseclick popover functionality.




















