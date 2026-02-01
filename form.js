'use strict'

/**
 * Fix num cores, allowing blanks to remain
 */
function fix_num_cores() {
  let node_type_input = $('#batch_connect_session_context_node_type');
  let node_type = node_type_input.val();
  let num_cores_input = $('#num_cores');

  if(num_cores_input.val() === '') {
    return;
  }
  
  if(node_type === 'hugemem') {
    set_ppn_red_hugemem(num_cores_input);
  } else {
    set_ppn_red_regular(num_cores_input);
  }
}

/**
 * Sets the PPN limits available for Red hugemem nodes.
 * 
 * hugemem reservations are always assigned the full node
 *
 * @param      {element}  num_cores_input  The input for num_cores
 */
function set_ppn_red_hugemem(num_cores_input) {
  const NUM_CORES = 48;
  num_cores_input.attr('max', NUM_CORES);
  num_cores_input.attr('min', NUM_CORES);
  num_cores_input.val(NUM_CORES);
}

/**
 * Sets the PPN limits available for non hugemem Red nodes.
 *
 * @param      {element}  num_cores_input  The input for num_cores
 */
function set_ppn_red_regular(num_cores_input) {
  const NUM_CORES = 28;
  num_cores_input.attr('max', NUM_CORES);
  num_cores_input.attr('min', 0);
  num_cores_input.val(Math.min(NUM_CORES, num_cores_input.val()));
}


/**
 * Change the maximum number of cores selected.
 */
function set_node_type_change_handler() {
  let node_type_input = $('#batch_connect_session_context_node_type');
  node_type_input.change(node_type_input, fix_num_cores);
}

/**
 * Toggle visibility of advanced options based on checkbox state
 */
function toggle_advanced_options() {
  let show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');
  let auto_qos_group = $('#batch_connect_session_context_auto_qos').closest('.form-group');
  let auto_conda_group = $('#batch_connect_session_context_auto_conda').closest('.form-group');
  let v_version_group = $('#batch_connect_session_context_v_version').closest('.form-group');
  let working_dir_group = $('#batch_connect_session_context_working_dir').closest('.form-group');
  
  if (show_advanced) {
    auto_qos_group.show();
    auto_conda_group.show();
    v_version_group.show();
    working_dir_group.show();
  } else {
    auto_qos_group.hide();
    auto_conda_group.hide();
    v_version_group.hide();
    working_dir_group.hide();
  }
}

$(document).ready(function() {
  // Note: This form doesn't use node_type, but the code is retained for compatibility
  // The actual fields used are: auto_cores, auto_mem, bc_num_gpu, bc_num_hours, bc_num_slots, bc_queue, auto_qos
  
  // Set the max value to be what was set in the last session
  fix_num_cores();
  set_node_type_change_handler();
  
  // Initialize advanced options visibility
  toggle_advanced_options();
  
  // Handle show_advanced checkbox changes
  $('#batch_connect_session_context_show_advanced').on('change', function() {
    toggle_advanced_options();
  });
  
  // Ensure the form properly handles the conda environment selection
  $('#batch_connect_session_context_auto_conda').on('change', function() {
    // This ensures that when a conda environment is selected, 
    // it's properly handled by the backend
    console.log('Conda environment selected:', $(this).val());
  });
  
  // Handle VSCode version selection
  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});
