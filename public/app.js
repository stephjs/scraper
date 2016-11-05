$.getJSON('/Nyts', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#articles').append(
      '<div class="articlebloc"><p data-id="' + data[i]._id + '"><span id="title">'
      + data[i].title + '</span><br />'
      + data[i].date + '<br />'
      + data[i].byline + '<br />'
      + data[i].summary + '</p></span>');
  }
});

$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "GET",
    url: "/Nyts/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" placeholder="Title">'); 
      $('#notes').append('<textarea id="bodyinput" name="body" placeholder="Note"></textarea>'); 
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
      $('#notes').append('<button data-id="' + data._id + '" id="deletenote">Delete Note</button>');
      if(data.note){
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
    });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "POST",
    url: "/Nyts/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});

$(document).on('click', '#deletenote', function(){
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: "POST",
    url: "/Nyts/" + thisId,
    data: {
      title: "",
      body: ""
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });
  $('#titleinput').val("");
  $('#bodyinput').val("");
});