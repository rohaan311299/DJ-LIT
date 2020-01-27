function changeImage(){
	var image=document.getElementById('myimage');
	if(image.src.match('newmap')){
		image.src="first.gif"		
	}
	else{
		image.src="second.gif"
	}
}