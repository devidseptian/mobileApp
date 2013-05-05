(function($){
function getMovies(query, page){

	return $.getJSON("http://api.rottentomatoes.com/api/public/v1.0/movies.json?callback=?",{
	
		apikey: "cpgzwuykp4se6466kpukbphd",
		q: query, 
		page: page,
		page_limit: 10
		}, function(data){
			return data;
	});
}
	function getMovie(id){
		return $.getJSON("http://api.rottentomatoes.com/api/public/v1.0/movies/" + id + ".json?callback=?",{
		apikey: "cpgzwuykp4se6466kpukbphd"
		}, function(data){
				return data;
		});
	}
	function renderTemplate(template, data, page, term, movieId){
		var def = $.Deferred;
		
		if (page && term) {
		data.page_number = page;
		data.search_term = term;
		}
		if (movieId) {
		data.movieId = movieId;
		}
		dust.render(template, data, function(err, out){
			def.raw = out;
			def.resolve;
		});
		return def;
	}
	
	function buildResults(term, page, checkResults){
		
		$.when(getMovies(term, page)).done(function(data){
			var field = $("#term");
			function renderer(){
				$.when(renderTemplate("listPage", data, page, term)).done(function(def){
					var page =  $(def.raw).appendTo("body").page();
					$.mobile.changePage(page);
				});
			}
			
			if (checkResults){
				$.mobile.loading("show", {
					text:"Loading movies"
				});
				
			
			if(data.total === 0 ){
					$("#noResult").find("#notFound").text(term).end().popup("open");
					field.next().click();
				} else {
					
					renderer();
				}
			} else {
				renderer();
			}
		});
	}
	function buildItem(movieId){
		$.when(getMovie(movieId)).done(function(data) {
			$.when(renderTemplate("itemPage", data, null, null, movieId)).done(function (def){
				var page = $(def.raw).appendTo("body").page();
				$.mobile.changePage(page);
			});
		});
	}
	$(document).on("pageinit", "#index", function(){
		
		$(this).on("click", "#search", function(e){
			
			e.preventDefault();
			
			buildResults($("#term").val(), 1, true);
		});
	});
	$(document).on("mobileinit", function(){
		$.mobile.defaultPageTransition ="slide";
		$.mobile.loader.prototype.options.textBisible = true;
		$.mobile.button.prototype.options.mini = true;
		
	});
	$(document).on("pagebeforechange", function (){
		if(document.location.hash.indexOf("listpage") !== -1 && !$("#listpage").length){
			var term = document.location.hash.split("term=")[1].split("&")[0],
				page = document.location.hash.split("page=")[1];
				
			buildResults(term, page, false);
		}else if (document.location.hash.indexOf("itempage") !== -1 && !$("#itempage").length){
			buildItem(document.location.hash.split("=")[1]);
		}
	});
	$(document).on("pageinit", "#listpage", function(){
		$(this).on("click", "div:jqmData(role = 'navbar')", function(e){
			e.preventDefault();
			var url = $.mobile.path.parseUrl($(e.srcElement).parent().attr("href")),
				term = url.search.split("q=")[1].split("&")[0],
				page = url.search.split("page=")[1];
				
			buildResults(term, page, false);
		});
	});
	$(document).on("click", "ul:jqmData(role='listview') a", function(e){
		e.preventDefault();
		
		function flipIt(string){
			return string.split("").reverse().join("");
		}
		
		var movieIdTemp = flipIt(this.href.split(".json")[0]);
			movieId = flipIt(movieIdTemp.split("/")[0]);
			
			buildItem(movieId);
	});
	
	$(document).on("pageshow", function(){
		var page = $.mobile.activePage,
			header = $("div:jqmData(role='header')");
			
		if (page[0].id !== "index" && !header.find("a").length){
			$("<a/>").attr("href", "index.html").text("Home").addClass("ui-btn-laft").buttonMarkup({
				icon: "arrow-l",
				theme: "a"
				
			}).prependTo(header);
		} else if (header.find("a").length && page[0].id === "index"){
			header.find("a").remove();
		}
		
	});
	$(document).on("pageshow", "#itempage", function(){
		var itempage =$(this);
		$("<div/>").html("<h3>Clips</h3>").appendTo($("#itempage").find("article")).collapsible({
			create: function (){
				$.getJSON("http://api.rottentomatoes.com/api/public/v1.0/movies/" + document.location.hash.split("=")[1] + "/clips.json?callback=?",{
					apikey: "cpgzwuykp4se6466kpukbphd"
				}, function(data){
					var content = $("<div/>").addClass("ui-grid-d");
					
					$.each(data.clips, function (i, clip){
						var blocks = {
							0: "ui-block-a",
							1: "ui-block-b",
							2: "ui-block-c",
							3: "ui-block-d",
							4: "ui-block-e"
						};
						if (i < 5){
							$("<a/>", {
								href: clip.links.alternate,
								"class": blocks[i],
								title:"Watch clip",
								html:["<img src='", clip.thumbnail, "' alt='", clip.title,"'/>"].join("")
							}).appendTo(content);
						}
						content.appendTo(itempage.find(".ui-collapsible-content"));
						$(".ui-mobile a img").css('max-width', '100%')
					});
				});
			}
		});
	});
	
	
})(jQuery);