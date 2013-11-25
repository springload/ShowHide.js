# ShowHide.js

Put simply, show a `data-showhide-container` when a `data-showhide-trigger` is clicked.

```
<span data-showhide-trigger='wheres-wally'>Find wally</span>

<div class='showhide--hidden' data-showhide-container='wheres-wally'>
    <h1>Oh hey, it's Wally!</h1>
</div>

```


# Options

Not all ShowHides are created equal. The plugin avoids a top-down global configuration and instead takes a number
of options passed as data-attributes to your DOM elements.

### Custom classNames

To apply a custom class to the `container` when the `trigger` is clicked:

```
<div class='showhide-hidden' data-showhide-container='wheres-wally' data-showhide-activeclass='wally-is-alive'>
    <h1>Oh hey, it's Wally!</h1>
</div>
```

To apply a custom class to the `trigger`:

```
<span data-showhide-trigger='wheres-wally'>Find wally</span>
<div class='showhide-hidden' data-showhide-container='wheres-wally' data-showhide-triggerclass='trigger-active'>
    <h1>Oh hey, it's Wally!</h1>
</div>
```

### Autoheight
The component will be sized to a specific height when shown. This is handy for animating the
height via CSS transitions:

```
<div class='showhide-hidden' data-showhide-container='wheres-wally' data-showhide-autoheight>
    <h1>Oh hey, it's Wally!</h1>
</div>
```

### Dismissable
The component will hide/toggle if the user clicks anywhere outside the component.


```
<div class='showhide-hidden' data-showhide-container='wheres-wally' data-showhide-dismissable>
    <h1>Oh hey, it's Wally!</h1>
</div>
```

### Groups
Especially handy for all your complex forms. Assign a `data-showhide-group` and all the other items in the group will be closed
when one group member is opened.

```
<span data-showhide-trigger='wheres-wally'>Find wally</span>
<div class='showhide-hidden' data-showhide-container='wheres-wally'  data-showhide-group='heroes'>
    <h1>Oh hey, it's Wally!</h1>
</div>
<span data-showhide-trigger='wheres-batman'>Find Batman™</span>
<div class='showhide-hidden' data-showhide-container='wheres-batman'  data-showhide-group='heroes'>
    <h1>Oh hey, it's Batman™!</h1>
</div>
```


### Hiding triggers

You can make triggers hide themselves (via a jQuery `.hide()` call) when clicked:

```
<span data-hide-self data-showhide-trigger='wheres-wally'>My trigger</span>

```


### Intro and exit animations

If the browser supports CSS3 animations, you can apply an in and out animation by passing a class that has a CSS animation registered against it.

```
<div class='showhide-hidden' data-showhide-container='wheres-batman' data-showhide-in='animFadeIn' data-showhide-out='animFadeOut'>
    <h1>Oh hey, it's Batman™!</h1>
</div>
```

In your stylesheet:

```css

@keyframes FadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes FadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.animFadeIn {
  animation: FadeIn 200ms backwards cubic-bezier(0.645, 0.045, 0.355, 1);
}

.animFadeOut {
  animation: FadeOut 200ms both cubic-bezier(0.645, 0.045, 0.355, 1);
}

```



# Events

ShowHide.js emits events on the document via jQuery eventing:


```
$document.on("showHide:show", function(showHideObject) {
    // do something awesome.
});

$document.on("showHide:close", function(showHideObject) {
    // do something less awesome.
});

```
