(function ( $ ) {
  $.fn.btFormAuthoringTools = function( options ) {

    var selectForm = '<option value="text_field">Text</option><option value="text_area">Text Area</option><option value="number_field">Number</option><option value="check_box">Checkbox</option><option value="radio_button">Radio Button</option><option value="select">Select</option><option value="email_field">Email</option><option value="telephone_field">Phone</option><option value="password_field">Password</option><option value="button">Button</option><option value="hidden_field">Hidden Field</option><option value="search_field">Search Field</option><option value="datetime_local_field">Datetime</option><option value="month_field">Month</option><option value="week_field">Week</option><option value="url_field">URL</option><option value="color_field">Color</option><option value="time_field">Time</option><option value="range_field">Range</option></select>';

    var $formItem = $('<div class="bfat-item">' +
      '<span class="bfat-item-handle"></span><input type="hidden" class="bfat-field-id" name="id" value="1">' +
      '<label>Field Type <select class="bfat-field-type" name="field_type">'+selectForm+'</select></label> ' +
      '<label>Field Label <input class="bfat-field-label" type="text" name="field_label"></label> ' +
      '<label>Field Name <input class="bfat-field-name" type="text" name="field_name"></label> ' +
      '<label><input class="bfat-field-required" type="checkbox" name="field_required"> Required?</label> ' +
      '<button class="bfat-remove-form-item" type="button">Remove Item</button> <button class="bfat-display-adv-fields" type="button">Adv Fields</button>'+
      '<div class="bfat-select-options" style="display: none;">'+
        '<p>Select Options <button class="bfat-add-select-item" type="button">+</button> <button class="bfat-display-select-fields" type="button">Adv Select Options</button></p>'+
        '<div class="bfat-select-item-list">'+
          '<div class="bfat-select-item">'+
            '<label>Value <input type="text" class="bfat-select-field-value"></label>'+
            '<label>Label <input type="text" class="bfat-select-field-label"></label>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="bfat-select-adv-options" style="display:none;">'+
        '<p>Select HTML Options</p>'+
        '<div>'+
          '<label>Select Classes <input type="text" class="bfat-adv-select-classes"></label>'+
          '<label>Select Attributes <input type="text" class="bfat-adv-select-custom"></label>'+
        '</div>'+
      '</div>'+
      '<div class="bfat-adv-field-options" style="display:none;">'+
        '<p>Advanced Field Options</p>'+
        '<div>'+
          '<label>Classes <input type="text" class="bfat-adv-field-classes"></label>'+
          '<label>Custom Attributes <input type="text" class="bfat-adv-field-custom"></label>'+
        '</div>'+
      '</div>'+
    '</div>');

    var basicForm = '<label>Form Title <input id="bfat-form-title" type="text" name="title"></label>' +
    '<label>Form Description <input id="bfat-form-description" type="text" name="description"></label>' +
    '<label>Button Text <input id="bfat-form-button-text" type="text" name="button_text"></label>' +
    '<button id="bfat-add-form-item" type="button">Add Form Item</button>' +
    '<div class="bfat-form-items">' +
      $formItem[0].outerHTML+
    '</div>'+
    '<input class="submit-button" type="submit" value="Create Form">';

    // Check if user passed options
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
      if( options.hasOwnProperty('existingObject')) {
        bfatConstructForm(options.existingObject, $formItem);
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
    $(".bfat-remove-form-item").click(function() {
      $(this).parent().remove();
      bfatReorderFormItems();
    });

    // Add event for first form item
    $(".bfat-add-select-item").click(function() {
      $(this).parent().next().append('<div class="bfat-select-item"><label>Value <input type="text" class="bfat-select-field-value"></label> <label>Label <input type="text" class="bfat-select-field-label"></label> <button class="bfat-remove-select-item" type="button">-</button></div>');

      //Remove the select option
      $(".bfat-remove-select-item").click(function() {
        $(this).parent().remove();
      });
    });

    // Toggle adv fields on first form item
    $(".bfat-display-adv-fields").click(function() {
      $(this).next().next().toggle();
    });

    // Toggle adv select options on first form item
    $(".bfat-display-select-fields").click(function() {
      $(this).parent().next().next().toggle();
    });

    toggleRemoveButton();
    // When the field type changes
    $('.bfat-field-type').change(onFieldTypeChange);

    // On add form item click
    $("#bfat-add-form-item").click(function() {
      var lastID = parseInt($('.bfat-item:last-child .bfat-field-id').val());
      $(".bfat-form-items").append('<div class="bfat-item"><span class="bfat-item-handle"></span><input type="hidden" class="bfat-field-id" name="id" value="'+(lastID+1)+'"><label>Field Type <select class="bfat-field-type">'+selectForm+'</select></label> <label>Field Label <input type="text" class="bfat-field-label"> </label><label>Field Name <input type="text" class="bfat-field-name"></label> <label><input type="checkbox" class="bfat-field-required"> Required?</label> <button class="bfat-remove-form-item" type="button">Remove Item</button> <button class="bfat-display-adv-fields" type="button">Adv Fields</button><div class="bfat-select-options" style="display: none;"><p>Select Options <button class="bfat-add-select-item" type="button">+</button> <button class="bfat-display-select-fields" type="button">Adv Select Options</button></p><div class="bfat-select-item-list"><div class="bfat-select-item"><label>Value <input type="text" class="bfat-select-field-value"></label> <label>Label <input type="text" class="bfat-select-field-label"></label></div></div><div class="bfat-select-adv-options" style="display:none;"><p>Select HTML Options</p><div><label>Select Classes <input type="text" class="bfat-adv-select-classes"></label> <label>Select Attributes <input type="text" class="bfat-adv-select-custom"></label></div></div></div><div class="bfat-adv-field-options" style="display:none;"><p>Advanced Field Options</p><div><label>Classes <input type="text" class="bfat-adv-field-classes"></label> <label>Custom Attributes <input type="text" class="bfat-adv-field-custom"></label></div></div></div>');

      //add event to remove this added form item
      $(".bfat-item:last-child .bfat-remove-form-item").click(function() {
        $(this).parent().remove();
        bfatReorderFormItems();
      });

      //check if there is only one button
      toggleRemoveButton();

      //Add adv field toggle on click
      $(".bfat-item:last-child .bfat-display-adv-fields").click(function() {
        $(this).next().next().toggle();
      });

      $(".bfat-item:last-child .bfat-display-select-fields").click(function() {
        $(this).parent().next().next().toggle();
      });

      //check if we changed to a select and show select options if so
      $('.bfat-item:last-child .bfat-field-type').change(onFieldTypeChange);

      //set up the select listeners on the new form item
      $(".bfat-item:last-child .bfat-add-select-item").click(function() {
        $(this).parent().next().append('<div class="bfat-select-item"><label>Value <input type="text" class="bfat-select-field-value"></label> <label>Label <input type="text" class="bfat-select-field-label"></label> <button class="bfat-remove-select-item" type="button">-</button></div>');

        //Remove the select option
        $(".bfat-select-item:last-child .bfat-remove-select-item").click(function() {
          $(this).parent().remove();
        });
      });
    });
    // end add form item click

    $(this).submit(function(e) {
      e.preventDefault();

      //remove all errors
      $('.error').remove();

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
          "field_required": required
        };

        if(type === "button") {
          field.button_value = label;
        }
        else if(type === "radio_button") {
          field.radio_button_tag_value = label;
        }
        else if(type === "select") {
          field.select_field_choices = {};
          $('.bfat-select-item', this).each(function(i) {
            field.select_field_choices[i] = {
              "value": $('.bfat-select-field-value', this).val(),
              "label": $('.bfat-select-field-label', this).val(),
            };
          });

          // Check for select classes / attributes
          var selectClass      = $('.bfat-adv-select-classes', this).val();
          var selectAttributes = $('.bfat-adv-select-custom', this).val();

          if(selectClass !== "") {
            field.select_field_html_options = {};
            field.select_field_html_options.class = selectClass;
          }

          if(selectAttributes !== "") {
            var obj = isValidJSON(selectAttributes);
            if(obj) {
              if( ! field.hasOwnProperty("select_field_html_options") ) {
                field.select_field_html_options = {};
              }
              $.each(obj, function(p, v) {
                field.select_field_html_options[p] = v;
              });
            } else {
              $('.bfat-select-adv-options', this).append("<p class=\"error\">Incorrectly formed JSON string for Select Attributes.</p>");
            }
          }
        }

        var itemClass = $('.bfat-adv-field-classes', this).val();

        if(itemClass !== "") {
          field.field_options = {};
          field.field_options.class = itemClass;
        }

        var customAttributes = $('.bfat-adv-field-custom', this).val();

        //get and check custom attribute json
        if(customAttributes !== "") {
          var json = isValidJSON(customAttributes);
          if(json) {
            //check if field_options need to be added
            if( ! field.hasOwnProperty("field_options") ) {
              field.field_options = {};
            }
            $.each(json, function(p, v) {
              field.field_options[p] = v;
            });
          } else {
            $('.bfat-adv-field-options', this).append("<p class=\"error\">Incorrectly formed JSON string for Custom Attributes.</p>");
          }
        }

        formObject.fields.push(field);
      });

      $(options.outputLocation).text(JSON.stringify(formObject, false, 2));
    });

    return this;
  };

  var bfatConstructForm = function(object, $formItem) {
    $('#bfat-form-button-text').val(object.submit);
    //remove default item added
    $('.bfat-item').remove();

    $.each(object.fields, function(p, v) {
      var tempForm = $formItem.clone();
      $('.bfat-field-id', tempForm).val(v.field_id);
      $('.bfat-field-type', tempForm).val(v.field_type);
      $('.bfat-field-label', tempForm).val(v.field_label);
      $('.bfat-field-name', tempForm).val(v.field_name);
      $('.bfat-field-required', tempForm).prop("checked", v.field_required);
      console.log(tempForm);
      $('.bfat-form-items').append(tempForm);
    });
  };

  var isValidJSON = function(obj) {
    try {
      var o = $.parseJSON(obj);

      if (o && typeof o === "object" && o !== null) {
        return o;
      }
    }
    catch (e) { }

    return false;
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

  var onFieldTypeChange = function() {
    if( $(this).val() === "select" ) {
      $(this).parent().siblings().eq(-2).show();
    } else {
      $(this).parent().siblings().eq(-2).hide();
    }
  };
}( jQuery ));
