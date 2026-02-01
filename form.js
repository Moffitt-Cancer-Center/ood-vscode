'use strict'

/**
 * Toggle visibility of advanced options based on checkbox state
 */
function toggle_advanced_options() {
  let show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');
  let auto_qos_group = $('#batch_connect_session_context_auto_qos').closest('.form-group');
  let auto_conda_group = $('#batch_connect_session_context_auto_conda').closest('.form-group');
  let v_version_group = $('#batch_connect_session_context_v_version').closest('.form-group');
  let working_dir_group = $('#batch_connect_session_context_working_dir').closest('.form-group');
  let reservation_group = $('#batch_connect_session_context_reservation').closest('.form-group');
  
  if (show_advanced) {
    auto_qos_group.show();
    auto_conda_group.show();
    v_version_group.show();
    working_dir_group.show();
    reservation_group.show();
  } else {
    auto_qos_group.hide();
    auto_conda_group.hide();
    v_version_group.hide();
    working_dir_group.hide();
    reservation_group.hide();
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
