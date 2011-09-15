(function($) {  
  $.widget("ui.rangecomparator", {
    // Scale is 0 - 100 to represent 0 to 100%
    options: { 
      ranges: null,
      width: "500px",  
      color: "#fff",
      extraCls: "",
      leftLabel: {
        text: "$",
        style: {
          color: "#666",
          fontSize: "12px"
        }
      },
      rightLabel: {
        text: "$$$",
        style: {
          color: "#DDD",
          fontSize: "12px"
        }
      },
      rangeStyle: {
        height: "15px",
        backgroundColor: "#FFF",
        color: "#666"
      }
    },
    _create: function() {  
      var self = this,  
             o = self.options,  
            el = self.element,
            jEl = $(el);

      // Let's store ranges for reuse
      self.options.ranges = self.options.ranges ? self.options.ranges : jEl.data("ranges");
      self.options.height = (parseInt(o.rangeStyle.height, 10) * (self._rangeLength() * 1.5)) + "px";
      // Add basic class and styling
      jEl.addClass("ui-widget ui-rangecomparator").css({
        height: o.height,
        width: o.width,
        color: o.color
      });

      if (o.extraCls !== "") { jEl.addClass(o.extraCls); }

      self._addLabels();
      self._addRanges();
      self._trigger("initialized", null, self);
    },
    _addRanges: function() {
      var self = this,
          jEl = $(self.element),
          i = 0,
          ranges = self.options.ranges;
      for (var key in ranges) {
        self._addRange(key, ranges[key][0], ranges[key][1], i);
        i++;
      }

    },
    _rangeLength: function() {
      var self = this,
             i = 0;
      for (var key in self.options.ranges) {
        i++;
      }
      return i;
    },
    _addRange: function(name, minimum, maximum, index) {
      var self = this,
          rOptions = self.options.rangeStyle,
          jEl = $(self.element);
      var new_position = self._calculatePositioning(minimum, maximum, index);

      var range = $("<div />", {text: name}).css({
        height: rOptions.height,
        backgroundColor: rOptions.backgroundColor,
        color: rOptions.color,
        position: "absolute",
        textAlign: "center",
        width: new_position.width,
        verticalAlign: "middle",
        top: new_position.top,
        left: new_position.left,
        lineHeight: rOptions.height
      }).addClass("ui-rangecomparator-range");
      jEl.append(range);
    },
    _calculatePositioning: function(minimum, maximum, index) {
      var self = this;
      var scale = self._getMinimumMaximum();
      var old_range = scale.max - scale.min;
      var new_range = 100 - 0;
      // Divide by 1.5 so they dont take the whole scale
      var min = ((((minimum - scale.min) * new_range) / old_range) / 2);
      var max = ((((maximum - scale.min) * new_range) / old_range) / 2);

      return {
        left: (min + 20) + "%",
        top: ((parseInt(self.options.rangeStyle.height.replace("px", ""), 10) * 1.5) * (index)) + "px",
        width: (max-min) + "%"
      };
    },
    _getMinimumMaximum: function() {
      var self = this,
          ranges = self.options.ranges,
          min = null,
          max = null;
      $.each(ranges, function(i, val){
        if (min) {
          if (val[0] < min) {
            min = val[0];
          }
        }else{
          min = val[0];
        }

        if (max) {
          if (val[1] > max) {
            max = val[1];
          }
        }else{
          max = val[1];
        }
      });
      return {
        min: min,
        max: max
      };
    },
    _addLabels: function() {
      var self = this;
      var range_comparator = $(self.element);
      self._addLeftLabel();
      self._addRightLabel();
    },
    _addRightLabel: function() {
      var self = this,
             o = self.options,
           jEl = $(self.element);
      var rightLabel = $("<div />", {
        text: o.rightLabel.text
      });
      // TODO: Calcule width of text instead of using hardcoded 30 value to make it more dynamic
      var left_position = jEl.width() - 30 + "px";
      rightLabel.css({
        "position": "absolute",
        "left": left_position,
        "top": self._calculateMiddleHeight(),
        "color": o.rightLabel.style.color
      });
      jEl.append(rightLabel);
    },
    _addLeftLabel: function() {
      var self = this,
             o = self.options;
      var leftLabel = $("<div />", {
        text: o.leftLabel.text,
        style: "position: absolute; top:" + self._calculateMiddleHeight() + "; left: 5px;"
      });
      leftLabel.css({
        color: o.leftLabel.style.color,
        position: "absolute",
        top: self._calculateMiddleHeight(),
        left: "5px"
      });
      $(self.element).append(leftLabel);       
    },
    _calculateMiddleHeight: function() {
      var self = this;
      var range_comparator = $(self.element);
      var label_font_size = parseInt(self.options.rightLabel.style.fontSize.replace("px", ""), 10);
      return (range_comparator.height() - label_font_size) / 2 + "px";
    }
  });
})(jQuery); 