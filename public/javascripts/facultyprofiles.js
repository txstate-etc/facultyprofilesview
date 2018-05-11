jQuery( document ).ready(function($) {
  $('#coll-dept').on('chosen:ready', function(){
    var searchbox = $('.chosen-search-input')
    searchbox.attr('id', 'department-search-input')
    searchbox.parent().prepend('<label for="department-search-input" class="sr-only">Search for college or department</label>')
    adjustDepartmentWidth()
  })

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

    adjustDepartmentWidth();
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
});

function getUrlParameters() {
  return shared.parseParameterPairs(window.location.search.substring(1));
}

function adjustDepartmentWidth() {
  var termWidth = $('.term-group').outerWidth();
  var deptWidth = $('.chosen-container').outerWidth() + $('.btn-search').outerWidth();
  console.log("test")

  while (Math.floor(deptWidth) > Math.floor(termWidth)) {
    var text = $('.chosen-single span').text();
    $('.chosen-single span').text(text.substring(0, text.length-1));
    var termWidth = $('.term-group').outerWidth();
    var deptWidth = $('.chosen-container').outerWidth() + $('.btn-search').outerWidth();
    console.log(deptWidth + " " + termWidth)
  }
}
