/* Author: Simon Gingras
	
*/
(function($){
	$("#salary-scale").rangecomparator({
		width: "800px",
		rangeStyle: {
			height: "16px",
			minWidth: "170px"
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
		}],
		legendAdded: function(p_Event, p_Legend) {
			p_Legend.find(".tooltip").qtip();
		}

	});
})(jQuery); 





















