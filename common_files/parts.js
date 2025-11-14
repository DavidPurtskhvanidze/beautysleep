$("#product-price").bind("DOMSubtreeModified", function() {
	var price = Number($("#product-price").text().replaceAll(' ', '').replaceAll('р.', ''));
	var price4 = Math.round(price / 4).toLocaleString();
	var price6 = Math.round(price / 6).toLocaleString();
	$(".parts-price").text(price6);
	$(".price4").text(price4);
	$(".price6").text(price6);
});
