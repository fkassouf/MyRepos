(function(){
    $.fn.fitMe = function() {
        this.filter("img").each(function() {
            var image = $(this);

            image.one("load", function() {
                // make parent container overflow hidden and position relative
                var image_parent = image.parent();
                image_parent.css({ 
                    "position": "relative",
                    "overflow": "hidden"
                });

                // make image position absolute
                image.css({"position": "absolute"});

                // center image in container
                if(image.width() >= image.height()) {
                    image.css({ "height": image_parent.innerHeight() + "px" });
                    var centerX = (image_parent.innerWidth() - image.width()) / 2;
                    image.css({ "left": centerX + "px" });

                    if(image.width() < image_parent.innerWidth()) {
                        image.css({ 
                            "width": image_parent.innerWidth() + "px", 
                            "height": "auto",
                            "left": "auto" 
                        });

                        var centerY = (image_parent.innerHeight() - image.height()) / 2;
                        image.css({"top": centerY + "px" });
                    }
                } else {
                    image.css({ "width": image_parent.innerWidth() + "px" });
                    var centerY = (image_parent.innerHeight() - image.height()) / 2;
                    image.css({"top": centerY + "px" });

                    if(image.height() < image_parent.innerHeight()) {
                        image.css({ 
                            "height": image_parent.innerHeight() + "px",
                            "width": "auto",
                            "top": "auto" 
                        });

                        var centerX = (image_parent.innerWidth() - image.width()) / 2;
                        image.css({ "left": centerX + "px" });
                    }
                }
            }).each(function() {
                if(image.complete) {
                    image.load();
                }
            });
        });
        return this;
    }
}(jQuery));