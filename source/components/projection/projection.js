/**********************************
Controller for the projection page
***********************************/

//FadeIn to mask the loading of the page elements
$(document).ready(function() {
    $('.slideshow').fadeIn(1000);
});

//We select the relevant section of video data corresponding to the projection
//QueryString is given by queryString.js imported in the <head>
if (QueryString.id) {
    var projId = QueryString.id;
} else {
    window.location = "../main-menu/main-menu.html";
}
if (QueryString.prev) {
    var prevMenu = QueryString.prev;
} else {
    var prevMenu = "main";
}

var projection = videos[projId];
var projectionDisplay = display.projection.projections[projId]
projectionDisplay.pathPrefix = display.projection.pathPrefix;

/*
The next passage rearranges the videos to make slides. slideify is
defined in arrayToSlides.js
*/
projection.videos = slideify(projection.videos)

/*
Function to determine the type of menu : single-slide, two-slide of more than two slides.
*/
if (projection.videos.length == 1) {
    var type = "single";
} else if (projection.videos.length == 2) {
    var type = "double";
} else {
    var type = "multiple";
}
/*
PureJS directive to fill the slides and the video html elements
*/
var videosDirective = {
    '.slidemenu': {
        'slide<-videos': {
            //The function below aims to give the right background image
            //for the slide depending on the type of menu and the position
            //of the slide
            '.imgzoneimg@class+': function(a) {
                if (type == "single") {
                    return " isolated_zone";
                } else if (type == "double") {
                    if (a.pos == 0) {
                        return " left_zone";
                    } else {
                        return " right_zone"
                    }
                } else {
                    if (a.pos == 0) {
                        return " left_zone";
                    } else if (a.pos < a.items.length - 1) {
                        return " center_zone";
                    } else {
                        return " right_zone"
                    }
                }
            },
            '.projection-video': {
                'video<-slide': {
                    '.projection-video-poster@src': '#{posterPathPrefix}/#{video.poster}',
                    '.projection-video-title': 'video.title',
                    '.@class+' : function(a) {
                        if (a.item.empty == true) {
                            emptyVideos = true;
                            return " empty-video-container";
                        }
                        else
                            return "";
                    }
                }
            },
        }
    }
};
//If emptyVideos remains false after the rendering, there is no empty
//video container and there is no need to call the rendering directive
//for empty videos container (doing this would result in an error)
var emptyVideos = false;
$('body').render(projection, videosDirective); //render the result

/*
PureJSDirective to display graphical elements on the page that don't
depend on the current projection
*/
var displayDirective = {
    '#droite@src': '#{projection.pathPrefix}/#{common.droite.main}',
    '#droite_hover@src': '#{projection.pathPrefix}/#{common.droite.hover}',
    '#gauche@src': '#{projection.pathPrefix}/#{common.gauche.main}',
    '#gauche_hover@src': '#{projection.pathPrefix}/#{common.gauche.hover}',
    '#prevMenu@href': function(a) {
        if (prevMenu == "main") {
            return "../main-menu/main-menu.html";
        } else {
            return "../menu/menu.html?id=" + prevMenu;
        }
    },
    '#prevMenuImg@src': '#{projection.pathPrefix}/#{common.accueil.main}',
    '#prevMenuImg_hover@src': '#{projection.pathPrefix}/#{common.accueil.hover}',
    '#proj@src': '#{projection.pathPrefix}/#{common.proj.main}',
    '#proj_hover@src': '#{projection.pathPrefix}/#{common.proj.hover}',
    '#equipe@src': '#{projection.pathPrefix}/#{common.equipe.main}',
    '#equipe_hover@src': '#{projection.pathPrefix}/#{common.equipe.hover}',
    '.playbutton@src': '#{projection.pathPrefix}/#{common.play}'
};
//Depending on the number of slides, we do not display the same background
if (type == "single") {
    displayDirective['.isolated_zone@src'] = '#{projection.pathPrefix}/#{common.zone.isolated}';
} else if (type == "double") {
    displayDirective['.left_zone@src'] = '#{projection.pathPrefix}/#{common.zone.left}';
    displayDirective['.right_zone@src'] = '#{projection.pathPrefix}/#{common.zone.right}';
} else {
    displayDirective['.center_zone@src'] = '#{projection.pathPrefix}/#{common.zone.center}';
    displayDirective['.left_zone@src'] = '#{projection.pathPrefix}/#{common.zone.left}';
    displayDirective['.right_zone@src'] = '#{projection.pathPrefix}/#{common.zone.right}';
}
//If some video containers are empty, delete the html nodes inside them
if (emptyVideos) {
    displayDirective['.empty-video-container'] = "";
}
$('body').render(display, displayDirective);

/*
PureJS directive to display graphical elements related to the current projection
*/
var projectionDisplayDirective = {
    '.bkgd@style+': function(a) {
        return "background-image: url(" + this.pathPrefix + this.background + ");"
    },
    '#titre@src': '#{pathPrefix}/#{titre}',
}
$('body').render(projectionDisplay, projectionDisplayDirective);


/*
Slideshow controller : uses the slideshow plugin to animate the slides
*/
$(document).ready(function() {
    $('.slideshowmenu').cycle({

        slideResize: false,
        containerResize: false,
        after: onAfter,
        before: onBefore,
        next: '#next',
        prev: '#prev',
        fx: 'scrollHorz',
        speed: 500,
        timeout: 0,
        startingSlide: 0
    });
});
function onBefore(curr, next, opts) {
    $('#prev')['hide']();
    $('#next')['hide']();
}
var appearTime = 250;
function onAfter(curr, next, opts) {
    currentMenu = opts.currSlide;
    $('#prev')[currentMenu == 0 ? 'hide' : 'show'](appearTime);
    $('#next')[currentMenu == opts.slideCount - 1 ? 'hide' : 'show'](appearTime);
    $('#introduction')['show'](appearTime);
    for (i = 0; i <= 5; i++) {
        var nom = "#goto" + i;
        $(nom)['show'](appearTime);
    }
}