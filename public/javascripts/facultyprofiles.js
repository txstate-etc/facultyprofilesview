jQuery( document ).ready(function($) {
  $('#coll-dept').chosen({
    placeholder_text_single: 'College / Department',
    inherit_select_classes: true,
    width: "80%"
  })

  $('#coll-dept').on('change', function(evt, params) {
    var selectedOption = $("option:selected", this);
    var selectedValue = selectedOption.val();
    if (selectedOption.hasClass('college')) {
      $('#college').val(selectedValue)
      $('#dept').val("")
    }
    else {
      $('#college').val("")
      $('#dept').val(selectedValue)
    }
    //TODO: Find a better way to do this.
    if (selectedValue.length > 30) {
      var truncated = selectedValue.substring(0,30) + "...";
      $('.chosen-single span').text(truncated)
    }
    //It needs to be even smaller on mobile
    var width = $('.chosen-container').width() + $('.btn-search').width()
    if ( width > $('.department-group .input-group').width() ) {
      var truncated = selectedValue.substring(0,20) + "...";
      $('.chosen-single span').text(truncated)
    }
  })

  $('.btn-more').click(function() {
    var target = $(this)
    var person = target.data("person");
    var type = target.data("type");
    window.location = "/profile/" + person + "/activity/" + type
  })

  $('.show-appointments').click(function(event) {
    $('.other-appointment').slideToggle();
    $(this).children('i').toggleClass('fa-caret-down fa-caret-up');
  })

  $('.faculty-department-search').submit(function(e){
    var search = $('#q').val() + $('#college').val() + $('#dept').val();
    if (search.length == 0) {
      e.preventDefault();
    }
  })

  if (tracking) {
    var container = $('.profile-image');
    var img = $('.profile-image img');
    if (container.length > 0 && !container.data('default')) {
      var dummy = $('<img>');
      dummy.css({position: 'absolute', top: 0, right: '100%', opacity: 0, width: 'auto'});
      dummy.attr('src', img.attr('src'));
      var face = new tracking.ObjectTracker(['face']);
      face.on('track', function(e) {
        if (e.data.length != 1) {
          // face detection failed, just show image
          img.css('opacity', 1);
          return;
        }
        var face = e.data[0];

        var w = dummy.width();
        var h = dummy.height();
        var fw = face.width;
        var fh = face.height;
        var left = face.x;
        var right = w-fw-face.x;
        var top = face.y;
        var bottom = h-fh-face.y;

        var distance = Math.min(left, right, top, bottom);
        var box = {
          x: left - distance,
          y: top - distance,
          w: fw+2*distance,
          h: fh+2*distance
        }

        var timer;
        var adjust_cropping = function () {
          cancelAnimationFrame(timer);
          var timer = requestAnimationFrame(function () {
            var cw = container.width();
            var zoom = cw/box.w;
            img.css({position: 'absolute', left: (-1*box.x*zoom)+'px', top: (-1*box.y*zoom)+'px', width: (w*zoom)+'px'});
          });
        }

        $(window).resize(adjust_cropping);
        adjust_cropping();
        img.css('opacity', 1);
        dummy.remove();
      });
      dummy.on('load', function () {
        tracking.track(dummy.get(0), face);
      })
      dummy.appendTo($('body'));
    } else {
      img.css('opacity', 1);
    }
  }

});

function getUrlParameters() {
  return shared.parseParameterPairs(window.location.search.substring(1));
}
