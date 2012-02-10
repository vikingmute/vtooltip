//     Vtip.js 1.0.3
//     (c) 2012 Viking.
//     For all details and documentation:
//     https://github.com/vikingmute/vtooltip
(function(){
	var settings = {
		//four postions,top left,right bottom
		position:'bottom',
		//three ways:normal or ajax or jsonp
		method:'normal',
		width:'auto'
	}
	var cache = {
		
	}
	$.fn.vtip = function(options,callback){
		var opts = $.extend({},settings,options);
		return this.each(function(){
			var timer;
			var trigger;
			var self = $(this);
			//the main container
			var container = $("<div class='vtip'></div>");
			container.css({'width':opts.width});
			//create the main tip
			var create = function(){
				//in normal method & ajax run for 1st time, init the container
				container.html('');				
				container.append($("<div class='inner'></div>"));

				//three ways to append the content
				if(opts.method === 'ajax' || opts.method === 'jsonp'){
					if(self.attr('rel')){
						var id = self.attr('rel');
						callback(cache[id],container.find('.inner'));	
					}else{
						container.find('.inner').html("Loading....");
						if(opts.method == 'ajax'){
							$.ajax({
								url:opts.url,
								dataType:"json",
								success:function(data){
									cache[data.id] = data;
									self.attr('rel',data.id);
									callback(data,container.find('.inner'));
									afterFix(opts.position);		
								}
							})
						}else{
							$.getJSON(opts.url,function(data){
								cache[data.id] = data;
								self.attr('rel',data.id);
								callback(data,container.find('.inner'));
								afterFix(opts.position);
							})
						}

					}
				}else{
					if(opts.desc){
						container.find('.inner').html(opts.desc);
					}else{
						container.find('.inner').html(self.attr('title'));
					}
				}
				container.css({'position':'absolute'});
				$('body').append(container);
			}
			//all the length and width 


			/*var adjust = function(position){
				var conti = true;
				var newpos;
				var x = self.offset().left;
				var y = self.offset().top;
				var winh = $(window).height();
				var scrollh = $(window).scrollTop();
				var bottomgap = winh - (y - scrollh)-selfy;
				var topgap = y - scrollh; 
				if(position == 'bottom'){
					if(bottomgap < 180){
						conti = false;
						newpos = 'top';
					}
				}else if(position == 'top'){
					if(topgap < 180){
						conti = false;
						newpos = 'bottom';
					}
				}
				return [conti,newpos];
			}*/
			var caculate = function(position){
				//all the length and width
				var selfx = self.width();
				var selfy = self.height(); 
				var x = self.offset().left;
				var y = self.offset().top;
				var bx = container.width();
				var by = container.outerHeight();
				if(position == 'top'){
					container.append($("<i class='wb_c2'></i>"));
					container.css({'top':y-by-8,'left':x+(selfx/2)-20});
				}else if(position == 'bottom'){
					container.append($("<i class='wb_c1'></i>"));
					container.css({'top':y+selfy+8,'left':x+(selfx/2)-20});
				}else if(position == 'left'){
					container.append($("<i class='wb_c4'></i>"));
					container.css({'top':y+(selfy/2)-20,'left':x-bx-8});
				}else if(position == 'right'){
					container.append($("<i class='wb_c3'></i>"));
					container.css({'top':y+(selfy/2)-20,'left':x+selfx+8});
				}
			}
			var afterFix = function(position){
				if(position == "top" || position == "left"){
					caculate(position);
				}
			}
			//tip events
			self.bind('mouseover',function(){
				trigger = setTimeout(function(){
					create();
					caculate(opts.position);

					container.show();
					container.bind('mouseover',function(){
						clearTimeout(timer);
					})
					container.bind('mouseout',function(){
						timer = setTimeout(function(){
							container.hide();
							container.remove();
						},600)
					})
				},200)

			})
			self.bind('mouseout',function(){
				clearTimeout(trigger);
				timer = setTimeout(function(){
					container.hide();
					container.remove();
				},600)
			})

		})
	}
})(jQuery)