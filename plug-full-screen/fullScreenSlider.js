"use strict";
var plugIn = new Object();
(function(P){
	P.slider = function(){
		this.parent;
		this.itemName;
		this.items;
		this.pageItems;
		this.currentPage = 0;
		this.speed = 5000;
		this.insideWrap;
		this.slideType = 'linear';
		this.pageUl;
		this.pageLis;
		this.getEle = function(tagCI){
			var idReg = new RegExp("^#");
			var classReg = new RegExp("^.");
			if(idReg.test(tagCI)){
				return document.getElementById(tagCI.replace(idReg,""));
			}
			if(classReg.test(tagCI)){
				return document.getElementsByClassName(tagCI.replace(classReg,""));
			}
		}
	};


	P.slider.prototype = {
		init: function(opt){
			var _self = this;
			_self.parent = _self.getEle(opt.parent);
			_self.itemName = opt.itemName;
			_self.items = _self.getEle(opt.itemName);
			_self.speed = opt.speed || _self.speed;
			_self.slideType = opt.slideType || _self.slideType;


			//里面包裹一层
			_self.parent.style.position = "relative";
			_self.insideWrap = document.createElement("div");
			_self.insideWrap.setAttribute("id","inside-wrap");
			var mycssText = "transition:all "+_self.speed/1000+"s "+_self.slideType+";"+
			"-moz-transition:all "+_self.speed/1000+"s "+_self.slideType+";"+
			"-webkit-transition:all "+_self.speed/1000+"s "+_self.slideType+";"+
			"-o-transition:all "+_self.speed/1000+"s "+_self.slideType+";";
	
			_self.insideWrap.style.cssText = mycssText;
			var cloneNode = _self.parent.innerHTML;
			_self.parent.innerHTML = "";
			_self.insideWrap.innerHTML = cloneNode;
			_self.parent.appendChild(_self.insideWrap);
			_self.items = _self.getEle(_self.itemName);

			//增加页码
			_self.pageUl = document.createElement("ul");
			var pageLiStr = '<li id="{{0}}" class="page-item"></li>';
			var pageLisStr = "";
			for(let i = 0; i< _self.items.length;i++){
				pageLisStr += pageLiStr.replace("{{0}}","page-" + i);
			}
			_self.pageUl.innerHTML = pageLisStr;
			_self.pageUl.setAttribute("id","page-items");
			_self.parent.appendChild(_self.pageUl);
			_self.pageLis = _self.getEle('.page-item');



			_self.renderInt();	
			for(let i = 0;i<_self.pageLis.length;i++){
				if(i == _self.currentPage){
					_self.pageLis[i].setAttribute("class","page-item c-page-item");
				}else{
					_self.pageLis[i].setAttribute("class","page-item");
				}
			}
			_self.events();
		},
		renderInt: function(){
			var _self = this;

			//定义包裹样式
			_self.insideWrap.style.height = _self.parent.clientHeight * _self.items.length + "px";
			_self.insideWrap.style.width = _self.parent.clientWidth + "px";
			
			//定义
			for(let i = 0;i<_self.items.length;i++){
				_self.items[i].style.height = _self.parent.clientHeight + "px";
				_self.items[i].style.width = _self.parent.clientWidth + "px";
			}


		},
		events: function(){
			var _self = this;

			var canScroll = true;

			function slidGo(){
				_self.insideWrap.style.top = "-" + (_self.parent.clientHeight * _self.currentPage) + "px";
				for(let i = 0;i<_self.pageLis.length;i++){
					if(i == _self.currentPage){
						_self.pageLis[i].setAttribute("class","page-item c-page-item");
					}else{
						_self.pageLis[i].setAttribute("class","page-item");
					}
				}
			};

			function clickFunc(e){
				//事件委托
				var target = e.target || e.srcElement;
				if(target.nodeName.toLowerCase() == "li"){
					_self.currentPage = parseInt(target.id.replace('page-',''));
					slidGo();
				}
			};


			function addEvent(obj,type,handle){
			    try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
			        obj.addEventListener(type,handle,false);
			    }catch(e){
			        try{  // IE8.0及其以下版本
			            obj.attachEvent('on' + type,handle);
			        }catch(e){  // 早期浏览器
			            obj['on' + type] = handle;
			        }
			    }
			};

			function scrollDirection(e){
				var direction = 0;
				if (e.wheelDelta) {  //IE，谷歌             
		            if (e.wheelDelta > 0) { //up
		                direction = 1;
		            }
		            if (e.wheelDelta < 0) { //down
		                direction = -1;
		            }
	        	} else if (e.detail) {  //ff
		            if (e.detail> 0) { //up
		                direction = 1;
		            }
		            if (e.detail< 0) { //down
		                direction = -1;
		            }
	        	}
	        	return direction;
			};

			function resizeFunc(){
				_self.renderInt();
                _self.insideWrap.style.top = "-" + (_self.parent.clientHeight * _self.currentPage) + "px";
			};

			function scrollFunc(e){
				var scrollTime = "";
				if(canScroll){
					//防止重复滑动
					scrollTime = window.setTimeout(function(){
						window.clearTimeout(scrollTime);
						canScroll = true;
					},500);
					if(scrollDirection(e) == -1){//down
						if(_self.currentPage<_self.items.length-1){
							_self.currentPage++;
						}
					}else{//up
						if(scrollDirection(e) == 1){
							if(_self.currentPage>0){
								_self.currentPage--;
							}
						}
					}
					slidGo();
					canScroll = false;
				}
			};

			//窗口大小变化重新渲染
			addEvent(window,'resize',resizeFunc);

            //滚动事件
            addEvent(_self.parent,'mousewheel',scrollFunc);

            //页码点击事件
            addEvent(_self.pageUl,'click',clickFunc);
           
		},
	}


	return P.slider;
})(plugIn);