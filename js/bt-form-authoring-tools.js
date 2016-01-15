(function ( $ ) {
  $.fn.btFormAuthoringTools = function( options ) {

    var selectForm = '<option value="text_field">Text</option><option value="text_area">Text Area</option><option value="number_field">Number</option><option value="check_box">Checkbox</option><option value="radio_button">Radio Button</option><option value="select">Select</option><option value="email_field">Email</option><option value="telephone_field">Phone</option><option value="password_field">Password</option><option value="button">Button</option><option value="hidden_field">Hidden Field</option><option value="search_field">Search Field</option><option value="datetime_local_field">Datetime</option><option value="month_field">Month</option><option value="week_field">Week</option><option value="url_field">URL</option><option value="color_field">Color</option><option value="time_field">Time</option><option value="range_field">Range</option></select>';

    var basicForm = '<label>Form Title <input id="bfat-form-title" type="text" name="title"></label> <label>Form Description <input id="bfat-form-description" type="text" name="description"></label> <label>Button Text <input id="bfat-form-button-text" type="text" name="button_text"></label> <button id="bfat-add-form-item" type="button">Add Form Item</button><div class="bfat-form-items"><div class="bfat-item"><span class="bfat-item-handle"></span><input type="hidden" class="bfat-field-id" name="id" value="1"><label>Field Type <select class="bfat-field-type" name="field_type">'+selectForm+'</select></label> <label>Field Label <input class="bfat-field-label" type="text" name="field_label"></label> <label>Field Name <input class="bfat-field-name" type="text" name="field_name"></label> <label><input class="bfat-field-required" type="checkbox" name="field_required"> Required?</label> <button class="bfat-remove-form-item" type="button">Remove Item</button></div></div><input class="submit-button" type="submit" value="Create Form">';

    if( typeof options === 'object' ) {
      if( options.hasOwnProperty('fillform') ) {
        if(options.fillform) {
          $(this).html(basicForm);
        }
      }
      if( ! options.hasOwnProperty('outputLocation') ) {
        //default the output location to the id output
        options.outputLocation = '#output';
      }
    }

    //Requires jQuery UI sortable
    $('.bfat-form-items').sortable({
      axis: "y",
      handle: ".bfat-item-handle",
      placeholder: "ui-sortable-placeholder",
      stop: function( event, ui ) {
        bfatReorderFormItems();
      }
    });

    // Add remove event to first form item
    $(".bfat-item:last-child .bfat-remove-form-item").click(function() {
      $(this).parent().remove();
      bfatReorderFormItems();
    });

    toggleRemoveButton();

    $("#bfat-add-form-item").click(function() {
      var lastID = parseInt($('.bfat-item:last-child .bfat-field-id').val());
      $(".bfat-form-items").append('<div class="bfat-item"><span class="bfat-item-handle"></span><input type="hidden" class="bfat-field-id" name="id" value="'+(lastID+1)+'"><label>Field Type <select class="bfat-field-type">'+selectForm+'</select></label> <label>Field Label <input type="text" class="bfat-field-label"> </label><label>Field Name <input type="text" class="bfat-field-name"></label> <label><input type="checkbox" class="bfat-field-required"> Required?</label> <button class="bfat-remove-form-item" type="button">Remove Item</button></div>');
      //add event to remove this added form item
      $(".bfat-item:last-child .bfat-remove-form-item").click(function() {
        $(this).parent().remove();
        bfatReorderFormItems();
      });
      toggleRemoveButton();
    });

    $(this).submit(function(e) {
      e.preventDefault();

      //get form title and description
      var title      = $('#bfat-form-title').val();
      var desc       = $('#bfat-form-description').val();
      var buttonText = $('#bfat-form-button-text').val();

      //define the form created as an object
      var formObject = {
        "submit": buttonText === "" ? "Submit" : buttonText,
        "fields": []
      };

      $('.bfat-item').each(function(index) {

        var id       = $(this).find('.bfat-field-id').eq(0).val();
        var type     = $(this).find('.bfat-field-type').eq(0).val();
        var name     = $(this).find('.bfat-field-name').eq(0).val();
        var label    = $(this).find('.bfat-field-label').eq(0).val();
        var required = $(this).find('.bfat-field-required').eq(0).prop('checked');

        var field = {
          "field_order": id,
          "field_label": label,
          "field_name": name,
          "field_type": type,
          "field_options": {
              "class": "something"
          },
          "field_required": required
        };

        formObject.fields.push(field);
      });

      $(options.outputLocation).text(JSON.stringify(formObject, false, 4));
    });

    return this;
  };

  var bfatReorderFormItems = function() {
    toggleRemoveButton();
    $('.bfat-item').each(function(index) {
      $(this).find('.bfat-field-id').eq(0).val(index+1);
    });
  };

  // Takes away the ability to remove a form item if it's the last one
  var toggleRemoveButton = function() {
    if( $('.bfat-item').length === 1 ) {
      $('.bfat-remove-form-item').hide();
    }
    else if( $('.bfat-item').length === 2 ) {
      $('.bfat-remove-form-item').show();
    }
  };
}( jQuery ));
