'use strict'

function toggle_advanced_options() {
  var show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');

  var auto_qos_group            = $('#batch_connect_session_context_auto_qos').closest('.form-group');
  var v_version_group           = $('#batch_connect_session_context_v_version').closest('.form-group');
  var working_dir_group         = $('#batch_connect_session_context_working_dir').closest('.form-group');
  var reservation_group         = $('#batch_connect_session_context_reservation').closest('.form-group');
  var custom_packages_group     = $('#batch_connect_session_context_custom_packages').closest('.form-group');
  var extra_packages_group      = $('#batch_connect_session_context_extra_packages').closest('.form-group');
  var bypass_custom_build_group = $('#batch_connect_session_context_bypass_custom_build').closest('.form-group');

  // In the deployed OOD version, path_selector.js injects the "Select Path"
  // button as a sibling div AFTER the working_dir .form-group.  The Bootstrap
  // modal div (class "modal fade") may also be injected as a sibling.
  //
  // We use nextUntil to capture those siblings, but explicitly exclude any
  // element with class "modal".  If we let jQuery call .show() on a Bootstrap
  // modal div it sets display:block on it, turning it into a full-screen
  // overlay that silently blocks pointer events across the top of the page.
  var working_dir_btn = working_dir_group.nextUntil('.form-group').not('.modal');

  if (show_advanced) {
    auto_qos_group.show();
    v_version_group.show();
    working_dir_group.show();
    working_dir_btn.show();
    reservation_group.show();
    custom_packages_group.show();
    extra_packages_group.show();
    bypass_custom_build_group.show();
  } else {
    auto_qos_group.hide();
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
  // OOD caches the last-submitted form value.  If show_advanced was checked
  // in the previous session it will render pre-checked.  Force it off so
  // advanced options always start collapsed.
  $('#batch_connect_session_context_show_advanced').prop('checked', false);

  // Hide all advanced fields immediately.
  toggle_advanced_options();

  // path_selector.js injects its button in a later document.ready handler,
  // so the sibling does not exist yet on the call above.  A single
  // requestAnimationFrame fires once after ALL ready handlers complete, at
  // which point the button exists and is correctly hidden.
  requestAnimationFrame(toggle_advanced_options);

  $('#batch_connect_session_context_show_advanced').on('change', toggle_advanced_options);

  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });

  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});
