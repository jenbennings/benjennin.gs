var MIN_DISTANCE = 10;
var guides = [];
var innerOffsetX, innerOffsetY;

$( ".draggable" ).draggable({
    start: function( event, ui ) {
        guides = $.map( $( ".draggable" ).not( this ), computeGuidesForElement );
        innerOffsetX = event.originalEvent.offsetX;
        innerOffsetY = event.originalEvent.offsetY;
    },
    drag: function( event, ui ){
        var guideV, guideH, distV = MIN_DISTANCE+1, distH = MIN_DISTANCE+1, offsetV, offsetH;
        var chosenGuides = { top: { dist: MIN_DISTANCE+1 }, left: { dist: MIN_DISTANCE+1 } };
        var $t = $(this);
        var pos = { top: event.originalEvent.pageY - innerOffsetY, left: event.originalEvent.pageX - innerOffsetX };
        var w = $t.outerWidth() - 1;
        var h = $t.outerHeight() - 1;
        var elemGuides = computeGuidesForElement( null, pos, w, h );
        $.each( guides, function( i, guide ){
            $.each( elemGuides, function( i, elemGuide ){
                if( guide.type == elemGuide.type ){
                    var prop = guide.type == "h"? "top":"left";
                    var d = Math.abs( elemGuide[prop] - guide[prop] );
                    if( d < chosenGuides[prop].dist ){
                        chosenGuides[prop].dist = d;
                        chosenGuides[prop].offset = elemGuide[prop] - pos[prop];
                        chosenGuides[prop].guide = guide;
                    }
                }
            } );
        } );

        if( chosenGuides.top.dist <= MIN_DISTANCE ){
            $( "#guide-h" ).css( "top", chosenGuides.top.guide.top ).show();
            ui.position.top = chosenGuides.top.guide.top - chosenGuides.top.offset;
        }
        else{
            $( "#guide-h" ).hide();
            ui.position.top = pos.top;
        }

        if( chosenGuides.left.dist <= MIN_DISTANCE ){
            $( "#guide-v" ).css( "left", chosenGuides.left.guide.left ).show();
            ui.position.left = chosenGuides.left.guide.left - chosenGuides.left.offset;
        }
        else{
            $( "#guide-v" ).hide();
            ui.position.left = pos.left;
        }
    },
    stop: function( event, ui ){
        $( "#guide-v, #guide-h" ).hide();
    }
});


function computeGuidesForElement( elem, pos, w, h ){
    if( elem != null ){
        var $t = $(elem);
        pos = $t.offset();
        w = $t.outerWidth() - 1;
        h = $t.outerHeight() - 1;
    }

    return [
        { type: "h", left: pos.left, top: pos.top },
        { type: "h", left: pos.left, top: pos.top + h },
        { type: "v", left: pos.left, top: pos.top },
        { type: "v", left: pos.left + w, top: pos.top },
        { type: "h", left: pos.left, top: pos.top + h/2 },
        { type: "v", left: pos.left + w/2, top: pos.top }
    ];
}

$(".artboard").draggable('disable');

$(".item").bind('click drag', function(e) {
    e.stopPropagation();
    $(".item").removeClass('selected');
    $(".boxes").addClass('is-hidden');
    $(this).find('.boxes').removeClass("is-hidden");
    $(this).addClass("selected");
});

$('body').click(function(e) {
    e.stopPropagation();
    $(".item").removeClass("selected");
    $(".boxes").addClass('is-hidden');
});
