/* Author: Simon Gingras
	
*/
(function($){
	$("#salary-scale").rangecomparator({
		width: "570px",
		rangeStyle: {
			height: "16px",
			minWidth: "170px"
		},
		ranges: [{
			legend: {
				name: "Nationally"
			},
			style: {
				backgroundColor: "#83C9E9"	
			},
			minimum: 132000,
			maximum: 500000
		},{
			legend: {
				name: "Selected Locations"
			},
			style: {
				backgroundColor: "#F86C1F"
			},
			minimum: 156000,
			maximum: 250000
		}],
		rangesAdded: function(p_Event, p_Self) {
			$(p_Self.element).find(".tooltip").qtip();
		}

	});
})(jQuery); 





















