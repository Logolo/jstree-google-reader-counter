/* 
 * jsTree Google Reader Tree Counter plugin
 * 
 */
(function ($) {
	$.jstree.plugin("counter", {
		__init : function () { 
			var _this = this;
			var ctx = this.get_container();		
			ctx.bind("loaded.jstree after_open.jstree", function () {		
				_this.__append_counts();	
				_this.__set_title_sum();
			});
		},
		defaults : {
			text_limit : 20,
			new_entry_class : 'new-entry'
		},
		_fn : {
		    __set_title_sum : function() {
				var page_title = document.title.replace(/ \(\d+\)$/,"");
				var sum = 0;
				var _this = this;
				
				$.each(this.get_container_ul().children("li"), function(idx,val) {
					sum += _this._extract_count(_this.get_text($(val)));
				});
								
				(sum > 0) ? document.title = page_title+" ("+sum+")" : document.title = page_title;			
			},
		    __set_page_sum : function(count) {
				var cur_count = this._extract_count(document.title);
				var page_title = document.title.replace(/ \(\d+\)$/,"");
				
				(count === -1 || count === 1) ? cur_count += count : cur_count = count;					
				(cur_count > 0) ? document.title = page_title+" ("+cur_count+")" : document.title = page_title;				
			},
			__append_counts : function() {				
				var settings = this._get_settings().counter;			
				var _this = this;
				var sum = 0;
				var folders = this.get_container().find('li[rel="folder"]');
				var s = this.get_container().find('li[rel!="folder"]');
				
				$.each(s,function(idx,val) {
					var node = $(val);	
					
					if(node.data('title')) {
						return;
					}
					
					var node_text = _this.get_text(node);
					var count = parseInt(node.attr('count'));					
					node.data('title',node_text);
				
					if(node_text.length > settings.text_limit) node_text = node_text.substring(0,settings.text_limit)+'...';
				
					if(count > 0 ) {
						sum += count;
						node.addClass(settings.new_entry_class);
						node_text += ' ('+count+')';
					}
				
					_this.set_text(node,node_text);			
				});
				
				$.each(folders, function(idx,folder) { 
					var folder = $(folder);
					
					if(folder.data('title')) {
						return;
					}
					
					var l = _this._get_children(folder);
					var folder_sum = 0;
			
					$.each(l,function(idx,val) {			
						var node = $(val);					
						var count = parseInt(node.attr('count'));
						folder_sum += count;					
					});
			
					var folder_text = _this.get_text(folder);
					folder.data('title',folder_text);
			
					if(folder_sum > 0 ) {
						folder_text = _this.get_text(folder) + ' (' + folder_sum + ')';
						folder.addClass(settings.new_entry_class);					
						_this.set_text(folder,folder_text);					
						folder.removeAttr('count');
					}
				});
				
				s.removeAttr('count');		
			},
			_extract_count : function(node_text) {
				var amountInt = 0;			
				var match = node_text.match(/\(\d+\)$/);
			
				if(match == null) return 0;
				
				var amountText = match[0];				
				return parseInt(amountText.substring(1,amountText.length-1));	
			},
			increase : function (selector) {
				var settings = this._get_settings().counter;
				var this_node = this._get_node(selector);
				
				if(this_node === false) {
					this.increase(this.get_selected());
					return;
				}
				
				var node_text = this.get_text(this_node);
				
				if(node_text) {
					var amountInt = this._extract_count(node_text);
					var parent_node = this._get_parent(this_node);
			
					if(amountInt > 0) {				
						amountInt += 1;				
						var amountText = node_text.replace(/\(\d+\)$/,"("+amountInt+")");
						this.set_text(selector,amountText);				
					} else {
						var amountText = node_text+" (1)";
						this.set_text(selector,amountText);
						this_node.addClass(settings.new_entry_class);
					}
			
					if(parent_node == -1) {
						var title_amountInt = this._extract_count(document.title);
						var incr = title_amountInt + 1;
						this.__set_page_sum(1);					
					} else {
						this.increase(parent_node);
					}
				}
			},
			decrease : function (selector) {
				var settings = this._get_settings().counter;	
				var this_node = this._get_node(selector);
				
				if(this_node === false) {
					this.decrease(this.get_selected());
					return;
				}
				
				var node_text = this.get_text(this_node);
				
				if(node_text) {				
					var match = node_text.match(/\(\d+\)$/);
					var parent_node = this._get_parent(this_node);
					
					
					if(match !== null) {				
						var amountText = match[0];						
						var amountInt = parseInt(amountText.substring(1,amountText.length-1));
						amountInt -= 1;

						if(amountInt == 0) {
							amountText = node_text.replace(/\(\d+\)$/,"");
							this_node.removeClass(settings.new_entry_class);
						} else {
							amountText = node_text.replace(/\(\d+\)$/,"("+amountInt+")");
						}
						this.set_text(selector,amountText);
					}

					if(parent_node == -1) {
						var title_amountInt = this._extract_count(document.title);
						var decr = title_amountInt - 1;
						this.__set_page_sum(-1);
					} else {
						this.decrease(parent_node);
					}
				}
			},
			// overrides jstree refresh method. not for public use intended!
			refresh : function(obj) {
				var _this = this;
				this.save_opened();				
				if(!obj) { obj = -1; }				
				obj = this._get_node(obj);				
				if(!obj) { obj = -1; }
				if(obj !== -1) { obj.children("UL").remove(); }
				
				this.load_node(obj, function () { 					
					_this.__callback({ "obj" : obj});					
					this.__append_counts();
					this.__set_title_sum();
					_this.reload_nodes(); 	
				});
			}
		}
	});
})(jQuery);