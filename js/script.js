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
				name: function() {
					return "Nationally <a href='javascript://' title='Nationally' class='tooltip'>[?]</a>"; 
				}
			},
			style: {
				backgroundColor: "#AAA"	
			},
			minimum: 132000,
			maximum: 900000
		},{
			legend: {
				name: function() {
					return "Selected Locations <a href='javascript://' title='Selected Locations' class='tooltip'>[?]</a>"; 
				}
			},
			style: {
				backgroundColor: "#FFF"
			},
			minimum: 156000,
			maximum: 250000
		}],
		rangesAdded: function(p_Event, p_Self) {
			$(p_Self.element).find(".tooltip").qtip();
		},
		legendAdded: function(p_Event, p_Legend) {
			p_Legend.find(".tooltip").qtip();
		}

	});
})(jQuery); 





















