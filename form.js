'use strict'

/**
 * Toggle visibility of advanced options based on checkbox state.
 *
 * NOTE on working_dir / path_selector:
 *   OOD's path_selector widget renders TWO separate DOM elements for a single
 *   attribute — the text input lives inside a standard .form-group div, but
 *   the "Select Path" button is injected by OOD's JavaScript into its OWN
 *   sibling container outside that .form-group.  Hiding the .form-group alone
 *   therefore leaves the button visible.
 *
 *   OOD places the button inside an element whose ID ends with
 *   "_path_selector_group" or whose data-path-selector attribute matches the
 *   input's ID.  We hide both elements together via a combined jQuery set.
 */
function toggle_advanced_options() {
  let show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');
  let auto_qos_group = $('#batch_connect_session_context_auto_qos').closest('.form-group');
  let auto_conda_group = $('#batch_connect_session_context_auto_conda').closest('.form-group');
  let v_version_group = $('#batch_connect_session_context_v_version').closest('.form-group');
  let reservation_group = $('#batch_connect_session_context_reservation').closest('.form-group');
  let custom_packages_group = $('#batch_connect_session_context_custom_packages').closest('.form-group');
  let extra_packages_group = $('#batch_connect_session_context_extra_packages').closest('.form-group');
  let bypass_custom_build_group = $('#batch_connect_session_context_bypass_custom_build').closest('.form-group');

  // working_dir: collect BOTH the form-group (text input) AND the path
  // selector button container that OOD renders as a sibling in the DOM.
  let working_dir_input     = $('#batch_connect_session_context_working_dir');
  let working_dir_form_group = working_dir_input.closest('.form-group');

  // OOD inserts the "Select Path" button launcher in one of these ways
  // depending on version; try all known patterns and merge into one set:
  //   1. A sibling element with data-path-selector or data-target referencing
  //      the input ID (OOD 3.x / latest).
  //   2. A sibling element whose ID ends with "_path_selector_group" (older OOD).
  //   3. The immediate next sibling of the form-group (fallback).
  let field_id              = 'batch_connect_session_context_working_dir';
  let working_dir_path_btn  =
    $('[data-path-selector="' + field_id + '"],' +
      '[data-target="#' + field_id + '_modal"],' +
      '[data-toggle="modal"][data-target*="working_dir"]').closest('div').not('.form-group')
    .add($('#' + field_id + '_path_selector_group'))
    .add($('#' + field_id + '_path_selector').closest('div').not('.form-group'));

  // Deduplicate: if nothing matched the specific selectors, fall back to the
  // next sibling of the form-group (works across all known OOD versions).
  if (working_dir_path_btn.filter(':visible, :hidden').length === 0) {
    working_dir_path_btn = working_dir_form_group.next();
  }

  let working_dir_all = working_dir_form_group.add(working_dir_path_btn);

  if (show_advanced) {
    auto_qos_group.show();
    auto_conda_group.show();
    v_version_group.show();
    working_dir_all.show();
    reservation_group.show();
    custom_packages_group.show();
    extra_packages_group.show();
    bypass_custom_build_group.show();
  } else {
    auto_qos_group.hide();
    auto_conda_group.hide();
    v_version_group.hide();
    working_dir_all.hide();
    reservation_group.hide();
    custom_packages_group.hide();
    extra_packages_group.hide();
    bypass_custom_build_group.hide();
  }
}

$(document).ready(function() {
  // Initialize advanced options visibility
  toggle_advanced_options();
  
  // Handle show_advanced checkbox changes
  $('#batch_connect_session_context_show_advanced').on('change', function() {
    toggle_advanced_options();
  });
  
  // Log when conda environment is selected
  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });
  
  // Log when VSCode version is selected
  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});


$(document).ready(function() {
  // Initialize advanced options visibility
  toggle_advanced_options();
  
  // Handle show_advanced checkbox changes
  $('#batch_connect_session_context_show_advanced').on('change', function() {
    toggle_advanced_options();
  });
  
  // Log when conda environment is selected
  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });
  
  // Log when VSCode version is selected
  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});
