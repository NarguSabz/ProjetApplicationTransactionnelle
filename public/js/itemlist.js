var $ = require("jquery");
// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the user table on initial page load
  populateTable();
});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';
  // jQuery AJAX call for JSON
  $.getJSON( '/admin', function( data ) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
    
      tableContent += '<tr>';
      tableContent += '<td>' + this.numid +'</td>';
      tableContent += '<td>' + this.nombrestock + '</td>';
      tableContent += '<td>' + this.prix + '</td>';
      tableContent += '</tr>';
      
  });
        // Inject the whole content string into our existing HTML table        $('#userList table tbody').html(tableContent);    });};
    // Inject the whole content string into our existing HTML table
    $('#itemList table tbody').html(tableContent);
  });
};