'use strict'

/**
 * Toggle visibility of advanced options based on the show_advanced checkbox.
 *
 * path_selector note:
 *   OOD injects the "Select Path" button as a SIBLING div AFTER the
 *   working_dir .form-group (outside it).  We use nextUntil('.form-group')
 *   to capture that sibling so it is hidden/shown alongside the input.
 *
 *   The button does not exist when document.ready first fires because OOD's
 *   path_selector.js injects it in a LATER registered ready handler.
 *   A single requestAnimationFrame defers one re-run of this function until
 *   after ALL document.ready handlers have completed — at which point the
 *   button exists and is correctly hidden or shown.
 *
 *   WHY NOT MutationObserver:
 *   Watching childList+subtree on <body> fires on EVERY <option> element
 *   insertion when auto_qos and auto_conda are dynamically populated
 *   (potentially hundreds of times).  This floods the callback, prevents
 *   the observer from ever disconnecting reliably, and interferes with the
 *   show/hide toggle and field interactivity.
 *
 *   WHY NOT setTimeout:
 *   A fixed-delay timer that re-calls toggle_advanced_options() races with
 *   user interaction and can override a hide the user just triggered,
 *   making re-hiding appear broken.
 */
function toggle_advanced_options() {
  var show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');

  var auto_qos_group            = $('#batch_connect_session_context_auto_qos').closest('.form-group');
  var auto_conda_group          = $('#batch_connect_session_context_auto_conda').closest('.form-group');
  var v_version_group           = $('#batch_connect_session_context_v_version').closest('.form-group');
  var working_dir_group         = $('#batch_connect_session_context_working_dir').closest('.form-group');
  var reservation_group         = $('#batch_connect_session_context_reservation').closest('.form-group');
  var custom_packages_group     = $('#batch_connect_session_context_custom_packages').closest('.form-group');
  var extra_packages_group      = $('#batch_connect_session_context_extra_packages').closest('.form-group');
  var bypass_custom_build_group = $('#batch_connect_session_context_bypass_custom_build').closest('.form-group');

  // Siblings between working_dir form-group and the next form-group —
  // this is where OOD injects the "Select Path" button container.
  var working_dir_btn = working_dir_group.nextUntil('.form-group');

  if (show_advanced) {
    auto_qos_group.show();
    auto_conda_group.show();
    v_version_group.show();
    working_dir_group.show();
    working_dir_btn.show();
    reservation_group.show();
    custom_packages_group.show();
    extra_packages_group.show();
    bypass_custom_build_group.show();
  } else {
    auto_qos_group.hide();
    auto_conda_group.hide();
    v_version_group.hide();
    working_dir_group.hide();
    working_dir_btn.hide();
    reservation_group.hide();
    custom_packages_group.hide();
    extra_packages_group.hide();
    bypass_custom_build_group.hide();
  }
}

$(document).ready(function() {
  // Run immediately: hides/shows form-groups based on current checkbox state.
  // The path_selector button does not exist yet at this point (working_dir_btn
  // will be an empty set), but all other fields are handled correctly here.
  toggle_advanced_options();

  // Run once after ALL document.ready handlers have completed.
  // jQuery fires every registered ready handler synchronously in order before
  // yielding to the browser, so by the time requestAnimationFrame executes,
  // OOD's path_selector.js has already injected the button into the DOM.
  requestAnimationFrame(toggle_advanced_options);

  // Re-evaluate on every checkbox change.
  $('#batch_connect_session_context_show_advanced').on('change', toggle_advanced_options);

  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });

  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});
