(function(){
	var settings = {
		//two postions,top left
		position:'bottom',
		//two ways:normal or ajax
		method:'normal'
	}
	$.fn.vtip = function(options,callback){
		var opts = $.extend({},settings,options);
		return this.each(function(){
			var timer;
			var self = $(this);
			var loaded = false;
			//the main container
			var container = $("<div class='vtip'></div>");
			//create the main tip
			var create = function(){
				//in normal method & ajax run for 1st time, init the container
				if(!loaded){
					container.html('');
					container.append($("<i class='wb_c1'></i>"));
					container.append($("<div class='inner'></div>"));
				}
				//two ways to append the content
				if(opts.method === 'ajax'){
					if(loaded){
						
					}else{
						container.find('.inner').html("Loading....");
						$.ajax({
							url:opts.url,
							dataType:"json",
							success:function(data){
								loaded = true;
								callback(data,container.find('.inner'));		
							}
						})
					}

				}else{
					container.find('.inner').html(self.attr('title'));
				}
				container.css({'position':'absolute'});
				$('body').append(container);
			}
			//tip events
			self.bind('mouseover',function(){
				create();
				var x = self.offset().left;
				var y = self.offset().top;
				var selfx = self.width();
				var selfy = self.height();
				if(opts.position === 'bottom'){
					container.css({'top':y+selfy+6,'left':x+(selfx/2)-20});
				}else{
					container.css({'top':y,'left':x+selfx});
				}
				container.show();
				container.bind('mouseover',function(){
					clearTimeout(timer);
				})
				container.bind('mouseout',function(){
					timer = setTimeout(function(){
						container.hide();
						if(!loaded){
							container.remove();
						}
					},600)
				})
			})
			self.bind('mouseout',function(){
				timer = setTimeout(function(){
					container.hide();
					if(!loaded){
						container.remove();
					}
				},600)
			})

		})
	}
})(jQuery)