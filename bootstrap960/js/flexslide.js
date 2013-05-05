
$(window).load(function(){
slide();


});

function slide(){
$('.flexslider').flexslider({
animation: "slide"

});
}

/* function slideIf(){
var wdt = $('.row-fluid').width();
			if (wdt <= 718){
				$('#folio').addClass('flexslider');
				$('#folio2').addClass('slides');
			}else if (wdt > 718){
				$('#folio').removeClass('flexslider');
				$('#folio2').removeClass('slides');
				$('#folio2').removeAttr('style').css();
			}else{
			$('#folio').removeClass('flexslider');
			$('#folio2').removeClass('slides');
			$('#folio2').removeAttr('style').css();
			}
} */