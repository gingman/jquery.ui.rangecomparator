(function($) {  
  $.widget("ui.rangecomparator", {
    // Scale is 0 - 100 to represent 0 to 100%
    options: { 
      ranges: [],
      width: "800px",  
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
        height: "16px",
        backgroundColor: "#FFF",
        paddingTop: "2px",
        paddingBottom: "2px",
        marginTop: "1px",
        marginBottom: "1px",
        borderWidth: "1px",
        color: "#666",
        label: {
          color: "#FFFFFF",
          backgroundColor: "#666"
        }
      }
    },
    _create: function() {  
      var self = this,  
             o = self.options,  
            el = self.element,
            jEl = $(el);

      // Let's store ranges for reuse
      self.options.ranges = self.options.ranges ? self.options.ranges : jEl.data("ranges");

      // We need to calculate the extra space needed for each range bar which means the padding, margin and the size of the border
      var extra_height = self._calculateExtraPositioning(self.options.ranges.length);

      self.options.height = ((parseInt(o.rangeStyle.height, 10) * self.options.ranges.length) + (extra_height)) + "px";

      self.scale = $("<div />", {
        "class": "ui-widget ui-rangecomparator"
      });

      self.scale.css({
        height: o.height,
        width: o.width,
        color: o.color
      });

      jEl.append(self.scale);


      if (o.extraCls !== "") { self.scale.addClass(o.extraCls); }

      self._addLabels();
      self._addRanges();
      self._addLegend();
      self._trigger("initialized", null, self);
    },
    _addRanges: function() {
      var self = this,
          jEl = $(self.scale),
          i = 0,
          ranges = self.options.ranges;

      if (typeof(ranges) === "undefined" || ranges === null || ranges.length === 0) {
        jEl.css({
          height: "16px",
          color: "#666",
          padding: "5px",
          background: "#DDD"
        });
        jEl.html("No ranges provided.");
      }else{
        $.each(ranges, function(i, range) {
          self._addRange(range, i);
        });
      }

      self._trigger("rangesAdded", null, self);
    },
    _addRange: function(p_RangeInfo, index) {
      var self = this,
          rOptions = self.options.rangeStyle,
          jEl = $(self.scale);
      var new_position = self._calculatePositioning(p_RangeInfo.minimum, p_RangeInfo.maximum, index);

      var extraCls = "";
      if (index === 0) {
        extraCls = "first";
      }
      if (index === (self.options.ranges.length - 1)) {
        extraCls = "last";
      }

      var range = $("<div />").css({
        height: rOptions.height,
        backgroundColor: p_RangeInfo.style.backgroundColor,
        color: rOptions.color,
        marginTop: rOptions.marginTop,
        marginBottom: rOptions.marginBottom,
        paddingTop: rOptions.paddingTop,
        paddingBottom: rOptions.paddingBottom,
        border: rOptions.borderWidth + " solid #666",
        position: "absolute",
        textAlign: "center",
        width: new_position.width,
        verticalAlign: "middle",
        top: new_position.top,
        left: new_position.left,
        lineHeight: rOptions.height
      }).addClass("ui-rangecomparator-range");

      // Add stripe
      if (index % 2 === 0) {
        range.css({
          background: 'url("img/salary-scale-even-bg.png") repeat ' + p_RangeInfo.style.backgroundColor
        }); 
      }else{
        range.css({
          background: 'url("img/salary-scale-odd-bg.png") repeat ' + p_RangeInfo.style.backgroundColor
        }); 
      }

      range.addClass(extraCls);
      jEl.append(range);

      var minimum_label = $("<div />", {text: self._formatMoney(p_RangeInfo.minimum)}).css({
        backgroundColor: rOptions.label.backgroundColor,
        color: rOptions.label.color,
        position: "absolute",
        left: "-25px",
        top: (range.height() - 11) / 2 + "px"
      });
      minimum_label.addClass("label minimum-label");

      var maximum_label = $("<div />", {text: self._formatMoney(p_RangeInfo.maximum)}).css({
        backgroundColor: rOptions.label.backgroundColor,
        color: rOptions.label.color,
        position: "absolute",
        left: range.width() - 10 + "px",
        top: (range.height() - 11) / 2 + "px"
      });
      maximum_label.addClass("label maximum-label");

      range.append(minimum_label);
      range.append(maximum_label);
      self._trigger("initialized", null, range);

    },
    _addLegend: function() {
      var self = this,
          jEl  = $(self.element),
          ranges = self.options.ranges;
      var legend = $("<ul />", {
        style: "margin-top: 10px; padding-left: 0px !important;"
      });
      $.each(ranges, function(i, range) {
        var row = $("<li />", {
          style: "margin-bottom: 5px; list-style-type: none;"
        });
        var table = $("<table />");
        var tr = $("<tr />");
        var color = $("<td />", {
          style: "width: 15px; height: 15px; border: 1px solid #DDD;"
        });
        var name = $("<d />", {
          style: "padding-left: 5px; color: #666;"
        });

        name.append(self._getRangeName(range.legend.name));

        // Add stripe
        if (i % 2 === 0) {
          color.css({
            background: 'url("img/salary-scale-even-bg.png") repeat ' + range.style.backgroundColor
          }); 
        }else{
          color.css({
            background: 'url("img/salary-scale-odd-bg.png") repeat ' + range.style.backgroundColor
          }); 
        }
        tr.append(color);
        tr.append(name);
        table.append(tr);
        row.append(table);
        legend.append(row);
      });
      jEl.append(legend);
      self._trigger("legendAdded", null, legend);

    },
    _calculatePositioning: function(minimum, maximum, index) {
      var self = this;
      var scale = self._getMinimumMaximum();
      var old_range = scale.max - scale.min;
      var new_range = 100 - 0;
      // Divide by 1.5 so they dont take the whole scale
      var min = ((((minimum - scale.min) * new_range) / old_range) / 1.5);
      var max = ((((maximum - scale.min) * new_range) / old_range) / 1.5);

      return {
        left: (min + 15) + "%",
        top: ((parseInt(self.options.rangeStyle.height.replace("px", ""), 10) + self._calculateExtraPositioning(1)) * (index)) + "px",
        width: (max-min) + "%"
      };
    },
    /*
      Get the name for a given range object
    */
    _getRangeName: function(p_RangeName) {
      if (typeof(p_RangeName) == "function") {
        return p_RangeName();
      }else{
        return p_RangeName;
      }
    },
    /*
      Gather the minimum and maximum of all the ranges passed in parameters
      Ex: Range1 = 10000-15000
          Range2 = 12000-20000
          Output: {min: 10000, max: 20000}
    */
    _getMinimumMaximum: function() {
      var self = this,
          ranges = self.options.ranges,
          min = null,
          max = null;
      $.each(ranges, function(i, range){
        if (min) {
          if (range.minimum < min) {
            min = range.minimum;
          }
        }else{
          min = range.minimum;
        }

        if (max) {
          if (range.maximum > max) {
            max = range.maximum;
          }
        }else{
          max = range.maximum;
        }
      });
      return {
        min: min,
        max: max
      };
    },
    /*
      Generate two read only labels for background display
    */
    _addLabels: function() {
      var self = this;
      var range_comparator = $(self.element);
      self._addLeftLabel();
      self._addRightLabel();
    },
    /*
      Generate a left label using defined in rightLabel configuration
    */
    _addRightLabel: function() {
      var self = this,
             o = self.options,
           jEl = $(self.scale);
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
    /*
      Generate a label using defined in leftLabel configuration
    */
    _addLeftLabel: function() {
      var self = this,
          o = self.options,
          middleHeight = self._calculateMiddleHeight();
      var leftLabel = $("<div />", {
        text: o.leftLabel.text
      });
      leftLabel.css({
        color: o.leftLabel.style.color,
        position: "absolute",
        top: middleHeight,
        left: "5px"
      });
      $(self.scale).append(leftLabel);       
    },
    /*
      Convert a number into a K format string
      Examples: 100000 = $100k
                110111 = $100.1k
      - p_Number: Number to be converted
    */
    _formatMoney: function(p_Number) {
      num = p_Number.toString().replace(/\$|\,/g,'');
      if(isNaN(num)) {
        num = "0";
      }
        
      sign = (num == (num = Math.abs(num)));
      num = Math.floor(num*100+0.50000000001);
      cents = num%100;
      num = Math.floor(num/100).toString();
      if(cents<10) {
        cents = "0" + cents;      
      }
  
      for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
        num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
      }
      var first_part_of_number = parseInt(num.split(",")[0], 10);
      var last_part_of_number = num.split(",")[1].toString().charAt(0);
      var ending = "";
      if (last_part_of_number !== "0") {
        ending = "." + last_part_of_number;
      }

      return (((sign)?'':'-') + '$' + first_part_of_number + ending + "K");
    },
    /*
      Calculate extra positioning that is need by the bars. 
      Takes into account padding, margin and borderwidth defined in rangeStyle configuration
      - p_NumberOfRanges: Number of range you need to compare
    */
    _calculateExtraPositioning: function(p_NumberOfRanges) {
      var self = this,
          o = self.options;
      var padding = ((parseInt(o.rangeStyle.paddingTop, 10) * p_NumberOfRanges) + (parseInt(o.rangeStyle.paddingBottom, 10) * p_NumberOfRanges));
      var margin = ((parseInt(o.rangeStyle.marginTop, 10) * p_NumberOfRanges) + (parseInt(o.rangeStyle.marginBottom, 10) * p_NumberOfRanges));
      var border = ((parseInt(o.rangeStyle.marginTop, 10) * 2) * p_NumberOfRanges);

      return padding + margin + border;
    },
    /*
      Calculate the middle position of the whole range comparator
      This is used to add label that are directly in the middle of the range comparator
    */
    _calculateMiddleHeight: function() {
      var self = this;
      var range_comparator = $(self.scale);
      var label_font_size = parseInt(self.options.rightLabel.style.fontSize.replace("px", ""), 10);
      return (range_comparator.height() - label_font_size) / 2 + "px";
    }
  });
})(jQuery); 