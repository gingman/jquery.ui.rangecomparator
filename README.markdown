# jquery.ui.rangecomparator

jquery.ui.rangecomparator is a jquery ui plugin that displays multiple range in a chart like manner. 
To use it, simply copy jquery.ui.rangecomparator.js and the corresponding css file into your project and

  $("#mydiv").rangecomparator({
		ranges: [{
      name: "Nationally",
      color: "#AAA",
      minimum: 41250,
      maximum: 54000
    },{
      name: "New York-Northern New Jersey-Long Island MSA, NY",
      color: "#FFF",
      minimum: 41400,
      maximum: 56000
    }]
	});

There are defaults provided that can be changed on the first call.

	ranges: null,
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

 If you would like to change the height of a range bar, simply do.

 	$("#mydiv").rangecomparator({
 		rangeStyle: {
 			height: "20px"
 		},
 		ranges: [{
      name: "Nationally",
      color: "#AAA",
      minimum: 41250,
      maximum: 54000
    },{
      name: "New York-Northern New Jersey-Long Island MSA, NY",
      color: "#FFF",
      minimum: 41400,
      maximum: 56000
    }]
 	})