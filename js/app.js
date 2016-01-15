jQuery(document).ready(function($) {

  $("#add-form-item").click(function() {
    var lastID = parseInt($('.item:last-child .field-id').val());
    $(".form-items").append('<div class="item"><input type="hidden" class="field-id" name="id" value="'+(lastID+1)+'"><label>Field Type <select class="field-type"><option value="text">Text Field</option><option value="email">Email</option><option value="phone">Phone</option><option value="textarea">Text Area</option></select></label> <label>Field Label <input type="text" class="field-label"> </label><label>Field Name <input type="text" class="field-name"></label> <label><input type="checkbox" class="field-required"> Required?</label> <button class="remove-form-item" type="button">Remove Form Item</button></div>');
    //add event to remove this added form item
    $(".item:last-child .remove-form-item").click(function() {
      $(this).parent().remove();
      $('.item').each(function(index) {
        $(this).find('.field-id').eq(0).val(index+1);
      });
    });
  });

  $("#creation-form").submit(function(e) {
    e.preventDefault();

    //clear output form
    $("#example-form").html("");

    //get form title and description
    var title = $('#form-title').val();
    var desc  = $('#form-description').val();

    //define the initial JSON schema the user created
    var schema = {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": title,
      "description": desc,
      "type": "object",
      "properties": {},
      "required": []
    };

    $('.item').each(function(index) {

      var type = $(this).find('.field-type').eq(0).val();
      var name = $(this).find('.field-name').eq(0).val();
      var label = $(this).find('.field-label').eq(0).val();
      var required = $(this).find('.field-required').eq(0).prop('checked');

      schema.properties[name] = {
        "description": "Placeholder",
        "type": "string",
        "label": label,
        "field_type": type
      };

      if(required === true) {
        schema.required.push(name);
      }
    });


    //build output form values
    for(var p in schema.properties) {
      if ( !schema.properties.hasOwnProperty(p) ) continue; //unless we are a key, get out

      obj = schema.properties[p];

      if( obj.field_type === "textarea") {
        $form_item = $('<textarea name="'+p+'">');
        if(schema.required.indexOf(p) !== -1) {
          $form_item.prop('required', true);
        }
        $form_item = '<label>'+obj.label+'<br>' + $form_item.prop('outerHTML');
      }
      else {
        $form_item = $('<input type="'+obj.field_type+'" name="'+p+'">');
        if(schema.required.indexOf(p) !== -1) {
          $form_item.prop('required', true);
        }
        $form_item = '<label>'+obj.label+' '+$form_item.prop('outerHTML')+'</label><br>';
      }
      $("#example-form").append($form_item);
    }

    $("#output").text(JSON.stringify(schema, false, 4));
  });
});
