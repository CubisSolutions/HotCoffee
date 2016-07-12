//counter voor id van objecten.
var counter = 1;

sap.designstudio.sdk.Component.subclass("be.cubis.designstudio.textfillmulti.textFillMulti", function() 
		{

	//console.log("initialization of function class");

	var me = this;
	var fontSize = 16;
	var valueHigh = 0;
	var relativeSize = 0;

	//Properties
	me._text = "Cubis";
	me._percentage = null;
	me._meta_data = null;
	me._tuple = null;
	me._size = "20";


	//Methods
	me.init = function() 
	{
		console.log("init method");
		me.redraw();
	};

	// redraw
	me.redraw = function() 
	{
		console.log("redraw method");
		var my2Div = me.$()[0];

		// Clear any existing gauges. We'll redraw from scratch.
		d3.select(my2Div).selectAll("*").remove();

		if (me._percentage === null || me._percentage === "") 
		{
			var initText =["Cubis", "SAP", "Google"];
			var initValues = [100,80,20];
			var tuplenrs = (me.getHeight()/3);
			var spacing = 0.6 * 3;
			fontSize = (me.getHeight()/(3*3))

			for(i=0 ; i < 3; i++)
			{
				me._ID = counter;                  	  
				counter = counter + 1 ;
				me._size = initValues[i];
				me._text = initText[i];

				var svgText = d3.select(my2Div)
				  .append("svg:svg")
				  .attr("width", "100%")
				  .attr("height", tuplenrs-spacing);
				
				
				// Gradient for masking.
				svgText.append("linearGradient")
		        .attr("id","gradientGradient" + me._ID)
		        .attr("x1",0)
		        .attr("y1","50%")
		        .attr("x2", "100%")
		        .attr("y2", "50%")
		        .selectAll("stop")
		        .data([
		          {offset: "0%", color: me._progressColorCode, opacity:1},
		          {offset: (me._size + "%"), color: me._progressColorCode, opacity:1},
		          {offset: (me._size + "%"), color: me._textcolorCode, opacity:1},
		          {offset: "100%", color: me._textcolorCode, opacity:1} 
		        ])
		        .enter().append("stop")
		        .attr("offset", function(d) {return d.offset})
		        
		        .attr("stop-color", function(d) {return d.color})
		        .attr("stop-opacity", function(d){return d.opacity});
				
				
				// fill background
		        svgText.append("rect")
		        .attr("x",0)
		        .attr("y",0)
		        .attr("height","100%")
		        .attr("width", me._size + "%")
		        .attr("fill", me._progressFillColorCode);
		        console.log("fill background", "log");
		        
		        svgText.append("text")
		        .style("fill", me._progressColorCode)
		        .attr("x", 10)
		        .attr("y", 10)
		        .text( me._size + "%" )
		        .style("font-size" , ".8em");
		        
				// clipping path
		        svgText.append("clipPath")
		        .attr("id","clip-clip"+ me._ID)
		        .append("text")
		        .text(me._text)
		        .attr("x", 5)
		        .attr("y", (tuplenrs-10))
		        .style("font-size", fontSize + "px");        
		        
		        // masking frame
		        svgText.append("rect")
		        .attr("x",0)
		        .attr("y",0)
		        .attr("height", tuplenrs-spacing)
		        .attr("width", "100%")
		        .attr("fill", "url(#gradientGradient"+ me._ID +")")
		        .attr("clip-path","url(#clip-clip"+ me._ID +")");
		        
		        // Draw rectangle around the box.
		        svgText.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("height", tuplenrs-spacing)
				.attr("width" , "100%")
				.style("stroke", "black")
				.style("fill", "none");
				
			}


		}
		else 
		{
			//console.log(me._percentage.tuples.length+"");
			var tuple = me._percentage.tuples;

			// Calculate height for a single line. Devide height by number of lines in result set.
			// Remove one, for result line, and floor the value to an integer.
			var tuplenrs = (me.getHeight()/(me._percentage.tuples.length-1));
			var spacing = 0.6 * (me._percentage.tuples.length -1)
			fontSize = (me.getHeight()/((me._percentage.tuples.length-1)*3));
			console.log("Tuplenrs = " + tuplenrs);
			
			for(i=0 ; i < me._percentage.tuples.length; i++)
			{
				if(valueHigh < me._percentage.data[i] && me._meta_data.dimensions[1].members[tuple[i][1]].type !== "RESULT")
					{
						valueHigh = me._percentage.data[i];
					}
			}

			for(i=0 ; i < me._percentage.tuples.length; i++)
			{
				me._ID = counter;                  	  
				counter = counter + 1 ;
				me._size = me._percentage.formattedData[i];
				var size = me._percentage.data[i];
				me._text = me._meta_data.dimensions[1].members[tuple[i][1]].text;
				
				if(me._meta_data.dimensions[1].members[tuple[i][1]].type !== "RESULT")
				{
					relativeSize = (size/valueHigh)*100;
					console.log("relativeSize " + relativeSize + " size " + size + " highValue " + valueHigh);
					var svgText = d3.select(my2Div)
					.append("svg:svg")
					.attr("width", "100%")
					.attr("height", tuplenrs-spacing);

					// Fill background
					svgText.append("rect")
					.attr("x",0)
					.attr("y",0)
					.attr("height","100%")
					.attr("width", relativeSize + "%")
					.attr("fill", me._progressFillColorCode);
					console.log("fill background", "log");

					svgText.append("text")
					.style("fill", me._progressColorCode)
					.attr("x", 10)
					.attr("y", 10)
					.text( me._size + "%" )
					.style("font-size" , ".8em");

					// Gradient for masking.
					svgText.append("linearGradient")
					.attr("id","gradientGradient" + me._ID)
					.attr("x1",0)
					.attr("y1","50%")
					.attr("x2", "100%")
					.attr("y2", "50%")
					.selectAll("stop")
					.data([
					       {offset: "0%", color: me._progressColorCode, opacity:1},
					       {offset: (me._size + "%"), color: me._progressColorCode, opacity:1},
					       {offset: (me._size + "%"), color: me._textcolorCode, opacity:1},
					       {offset: "100%", color: me._textcolorCode , opacity:1} 
					       ])
					       .enter().append("stop")
					       .attr("offset", function(d) {return d.offset})

					       .attr("stop-color", function(d) {return d.color})
					       .attr("stop-opacity", function(d){return d.opacity});

					// Clipping path
					svgText.append("clipPath")
					.attr("id","clip-clip"+ me._ID)
					.append("text")
					.text(me._text)
					.attr("x", 5)
					.attr("y", (tuplenrs-10))
					.style("font-size", fontSize + "px");

					// Masking frame
					svgText.append("rect")
					.attr("x",0)
					.attr("y",0)
					.attr("height", tuplenrs-spacing)
					.attr("width", "100%")
					.attr("fill", "url(#gradientGradient"+ me._ID +")")
					.attr("clip-path","url(#clip-clip"+ me._ID +")");

					// Draw rectangle around the box.
					svgText.append("rect")
					.attr("x", 0)
					.attr("y", 0)
					.attr("height", tuplenrs-spacing)
					.attr("width" , "100%")
					.style("stroke", "black")
					.style("fill", "none");	
				}
			}
		}
	}

	// After update
	me.afterUpdate = function()
	{
		me.redraw();
	};

	// Percentage
	me.percentage = function(value) 
	{

		if (value === undefined) {
			return me._percentage;
		} else {
			me._percentage = value; 
			return me;
		}
	};

	// metadata
	me.metadata = function(value) 
	{            
		if (value === undefined) {
			return me._meta_data;
		} else {
			me._meta_data = value;
			me.redraw();
			return me;
		}
	};

	// Getters for the height and width of the component
	me.getWidth = function(){
		return me.$().width();
	};

	me.getHeight = function(){
		return me.$().height();
	};

	// Colorcode
	me.textcolorCode = function(value) 
	{
		if (value === undefined)
		{
			return me._textcolorCode;
		} 
		else
		{
			me._textcolorCode = value;
			me.redraw();
			return me;
		}
	};

	// ProgressColorcode
	me.progressColorCode = function(value) 
	{
		if (value === undefined)
		{
			return me._progressColorCode;
		} 
		else
		{
			me._progressColorCode = value;
			me.redraw();
			return me;
		}
	};

	// ProgressFillColorcode
	me.progressFillColorCode = function(value) 
	{
		if (value === undefined)
		{
			return me._progressFillColorCode;
		} 
		else
		{
			me._progressFillColorCode = value;
			//me.redraw();
			return me;
		}
	};

		});
