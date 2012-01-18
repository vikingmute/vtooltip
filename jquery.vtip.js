//     Vtip.js 1.0.0
//     (c) 2012 Viking.
//     For all details and documentation:
//     https://github.com/vikingmute/vtooltip
(function(){
	var settings = {
		//four postions,top left,right bottom
		position:'bottom',
		//three ways:normal or ajax or jsonp
		method:'normal'
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
			//create the main tip
			var create = function(conti){
				//in normal method & ajax run for 1st time, init the container
				container.html('');

				
				container.append($("<div class='inner'></div>"));

				//two ways to append the content
				if(opts.method === 'ajax'){
					if(self.attr('rel')){
						var id = self.attr('rel');
						callback(cache[id],container.find('.inner'));	
					}else{
						container.find('.inner').html("Loading....");
						$.getJSON(opts.url,function(data){
								cache[data.id] = data;
								self.attr('rel',data.id);
								callback(data,container.find('.inner'));
								if(conti[0]){
									caculate(opts.position);
								}else{
									caculate(conti[1]);
								}
								
						})
					}

					/*$.ajax({
						url:opts.url,
						dataType:"json",
						success:function(data){
							loaded = true;
							cache[data.id] = data;
							//container.attr('id',data.id);
							callback(data,container.find('.inner'));		
						}
					})*/
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
			var selfx = self.width();
			var selfy = self.height();

			var adjust = function(position){
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
			}
			var caculate = function(position){
				//all the length and width 
				var x = self.offset().left;
				var y = self.offset().top;
				var bx = container.width();
				var by = container.height();

				if(position == 'top'){
					container.append($("<i class='wb_c2'></i>"));
					container.css({'top':y-by-7,'left':x+(selfx/2)-20});
				}else if(position == 'bottom'){
					container.append($("<i class='wb_c1'></i>"));
					container.css({'top':y+selfy+6,'left':x+(selfx/2)-20});
				}else if(position == 'left'){
					container.append($("<i class='wb_c4'></i>"));
					container.css({'top':y+(selfy/2)-20,'left':x-bx-6});
				}else if(position == 'right'){
					container.append($("<i class='wb_c3'></i>"));
					container.css({'top':y+(selfy/2)-20,'left':x+selfx+6});
				}
			}
			//tip events
			self.bind('mouseover',function(){
				trigger = setTimeout(function(){
					var conti = adjust(opts.position);
					create(conti);
					if(conti[0]){
						caculate(opts.position);
					}else{
						caculate(conti[1]);
					}
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