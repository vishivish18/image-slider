$(document).ready(function() {
  const zoomJump = 0.5;
  let zoomFactor = 1;
  const imgContainer = $("#img-container");
  const imgWindow = $("#img-window");
  const imgWindowWidth = imgWindow.width();
  const imgWindowHeight = imgWindow.height();
  const imgWindowOffsetX = imgWindow.offset().left;
  const imgWindowOffsetY = imgWindow.offset().top;
  const centerX = imgWindow.height()/2;
  const centerY = imgWindow.height()/2;

  const imgPreview1 = $("#img-preview-1")
  const imgPreview2 = $("#img-preview-2")
  const imgPreview3 = $("#img-preview-3")
  imgPreview1.addClass("black-border")

  imgPreview1.on("click", function() {
    imgPreview1.addClass("black-border")
    imgPreview2.removeClass("black-border")
    imgPreview3.removeClass("black-border")
    imgContainer.attr("src", "images/large/shirt.jpg")
    // zoomFactor = 1;
    // zoom();
  })

  imgPreview2.on("click", function() {
    imgPreview2.addClass("black-border")
    imgPreview1.removeClass("black-border")
    imgPreview3.removeClass("black-border")
    imgContainer.attr("src", "images/large/red-shirt.jpg")
    // zoomFactor = 1;
    // zoom();
  })

  imgPreview3.on("click", function() {
    imgPreview3.addClass("black-border")
    imgPreview1.removeClass("black-border")
    imgPreview2.removeClass("black-border")
    imgContainer.attr("src", "images/large/blue-shirt.jpg")
    // zoomFactor = 1;
    // zoom(); 
  })

  function zoom() {
    console.log("called")
    const newImgContainerWidth = imgWindowWidth*zoomFactor;
    const newImgContainerHeight = imgWindowHeight*zoomFactor;
    console.log(newImgContainerWidth,newImgContainerHeight)
    imgContainer.animate({
      "width": `${newImgContainerWidth}px`,
      "height": `${newImgContainerHeight}px`,
      "top": `-${(newImgContainerHeight-imgWindowHeight)/2}px`,
      "left": `-${(newImgContainerWidth-imgWindowWidth)/2}px`,
    }, 500)
  }
  function move(event) {
    const x = event.pageX - imgWindowOffsetX;
    const y = event.pageY - imgWindowOffsetY;
    console.log(x)
    console.log(y)
    const newImgContainerWidth = imgWindowWidth*zoomFactor;
    const newImgContainerHeight = imgWindowHeight*zoomFactor;
    imgContainer.css({
      "top": `-${y/zoomFactor}px`,
      "left": `-${x/zoomFactor}px`,
    })
  }
  function determineQuadrant(clickX, clickY){
  console.log("yes")
    switch(true) {
        case clickX < centerX && clickY < centerY:
            return 2
            break;
        case clickX < centerX && clickY > centerY:
            return 3
            break;
        case clickX > centerX && clickY > centerY:
            return 4
            break;
        case clickX > centerX && clickY < centerY:
            return 1
            break;
        case clickX == centerX && clickY == centerY:
            return 0
            break;
        default:
            break;
    }
  }
  imgWindow.on('click', function(event ){
    zoomFactor += zoomFactor <= 2 ? zoomJump : 0;        
    const x = event.pageX - imgWindowOffsetX;
    const y = event.pageY - imgWindowOffsetY;
    let quadrant = determineQuadrant(x,y)
    console.log(x,y,centerX,centerY, quadrant)
    // zoom();    
    const newImgContainerWidth = imgWindowWidth*zoomFactor;
    const newImgContainerHeight = imgWindowHeight*zoomFactor;

    if (quadrant ==4 ){
      console.log("quadrant 4")
      imgContainer.animate({
        "bottom": `-${0}px`,
        "right": `-${0}px`,
        "width": `${newImgContainerWidth}px`,
        "height": `${newImgContainerHeight}px`,
      }, 500)  
    }
    if (quadrant ==3){
      console.log("quadrant 3")
      imgContainer.animate({
        "bottom": `-${0}px`,
        "left": `+${0}px`,
        "width": `${newImgContainerWidth}px`,
        "height": `${newImgContainerHeight}px`,
      }, 500)  
    }  
    if (quadrant ==2){
      console.log("quadrant 2")
      imgContainer.animate({
        "top": `+${0}px`,
        "left": `+${0}px`,
        "width": `${newImgContainerWidth}px`,
        "height": `${newImgContainerHeight}px`,
      }, 500)
    }
    if (quadrant ==1){
      console.log("quadrant 1")
      imgContainer.animate({
        "top": `+${0}px`,
        "right": `-${0}px`,
        "width": `${newImgContainerWidth}px`,
        "height": `${newImgContainerHeight}px`,
      }, 500)
    }

    // imgContainer.css({
    //   "top": `-${y}px`,
    //   "left": `-${x}px`,
    // })
  })
  $("#zoom-plus").on("click", function() {
    zoomFactor += zoomFactor <= 2 ? zoomJump : 0;
    zoom();
  })
  $("#zoom-minus").on("click", function() {
    zoomFactor -= zoomFactor >= 1.5 ? zoomJump : 0;
    zoom();
  })
  $("#zoom-reset").on("click", function() {
    zoomFactor = 1;
    zoom();
  })
  imgWindow.on("mousedown", function() {
    if(zoomFactor == 1)
      return;
    imgWindow.on("mousemove", move)
    imgWindow.on("mouseup", function() {
      imgWindow.off("mousemove")
      imgWindow.off("mouseup")
    })
  })
  imgWindow.on("dragstart", function() {
    return false;
  })
})