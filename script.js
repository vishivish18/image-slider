const largeImageUrls = [
  "http://localhost:3030/images/large/shirt.jpg",
  "http://localhost:3030/images/large/red-shirt.jpg",
  "http://localhost:3030/images/large/blue-shirt.jpg",
  "http://localhost:3030/images/large/shirt.jpg",
  "http://localhost:3030/images/large/red-shirt.jpg",
  "http://localhost:3030/images/large/blue-shirt.jpg",
  "http://localhost:3030/images/large/shirt.jpg",
  "http://localhost:3030/images/large/red-shirt.jpg",
  "http://localhost:3030/images/large/blue-shirt.jpg",
  "http://localhost:3030/images/large/shirt.jpg",
  "http://localhost:3030/images/large/red-shirt.jpg",
  "http://localhost:3030/images/large/blue-shirt.jpg",
]

$(document).ready(function() {
  const zoomJump = 0.5;
  let zoomFactor = 1;
  const imgContainer = $("#img-container");
  const imgWindow = $("#img-window");
  const thumbnailsImageContainer = $("#thumbnails-container #image-container");
  const imgAspectRatio = 1.302267;

  setImageWindowHeight()

  const imgWindowWidth = imgWindow.width();
  const imgWindowHeight = imgWindow.height();
  const imgWindowOffsetX = imgWindow.offset().left;
  const imgWindowOffsetY = imgWindow.offset().top;
  const centerX = imgWindow.height()/2;
  const centerY = imgWindow.height()/2;

  function setImageWindowHeight() {
    imgWindow.height(imgWindow.width() * imgAspectRatio)
  }

  $(window).resize(setImageWindowHeight);

  function initializeThumbnails() {

    // Calculate the width for the thumbnails container
    let thumbnailsContainerWidth = $(".image-controls").width() - $("#buttons-container").outerWidth(true);
    $("#thumbnails-container").css({
      "width": thumbnailsContainerWidth+"px"
    })

    for(index in largeImageUrls) {
      thumbnailsImageContainer.append(
        `<img data-image-id="${index}" class="thumbnail" src="${largeImageUrls[index]}">`
      )
    }

    // Calculate whether we need scroll arrow buttons
    // TODO: This along with other similar code has to be run every time window resizes to take care of
    // responsiveness.
    let allThumbnailsWidth = $("#image-container .thumbnail").outerWidth(true) * largeImageUrls.length
    let error = 0;
    if(thumbnailsContainerWidth - allThumbnailsWidth - error > 0) {
      $("#thumbnails-container .thumbnail-scroll-buttons").hide()
    } else {
      $("#thumbnails-container .thumbnail-scroll-buttons").show()
    }

    thumbnailsImageContainer.on("click", function(event) {
      // Find which child was clicked and correspondingly set the image in Image Container
      let childId = $(event.target).data("image-id")
      setSelectedImage(childId)
    })
  }

  initializeThumbnails();

  function setSelectedImage(index) {
    // Loads the image in the imageContainer
    imgContainer.attr("src", largeImageUrls[index])

    // Sets the selection in the thumbnails
    thumbnailsImageContainer.find(".thumbnail").each(function() {
      let thumbnail = $(this)
      thumbnail.data("image-id") == index ?
        thumbnail.addClass("black-border") :
        thumbnail.removeClass("black-border");
    })
  }

  // Load the first image in the imageContainer on first page load
  setSelectedImage(0)

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
  imgWindow.on('click', function(event ) {
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