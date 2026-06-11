'use strict'

/**
 * Toggle visibility of advanced options based on the show_advanced checkbox.
 *
 * WHY we target _wrapper divs (not .form-group):
 *   OOD wraps every attribute in a server-rendered outer div:
 *     <div id="batch_connect_session_context_FIELD_wrapper">
 *       <div class="form-group">...</div>
 *     </div>
 *
 *   For path_selector, Bootstrap 5 renders a modal dialog *inside* the
 *   .form-group:
 *     <div class="modal fade" id="..._path_selector"
 *          style="position:fixed; width:100%; height:100%">
 *
 *   If we call jQuery .hide()/.show() directly on the .form-group, we add
 *   inline display:none/block on the element that is the *parent* of a
 *   Bootstrap 5 fixed-position modal.  Bootstrap's stacking context code
 *   and z-index handling can leak through display toggles on parent elements,
 *   leaving an invisible overlay that intercepts pointer events near the top
 *   of the viewport.
 *
 *   Hiding the _wrapper div instead keeps our jQuery manipulation one level
 *   higher, so we never touch the element that directly contains the modal.
 *   The modal subtree is hidden as a descendant; Bootstrap's internal state
 *   is never disturbed.
 */
function toggle_advanced_options() {
  var show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');

  var wrappers = [
    $('#batch_connect_session_context_auto_qos_wrapper'),
    $('#batch_connect_session_context_auto_conda_wrapper'),
    $('#batch_connect_session_context_v_version_wrapper'),
    $('#batch_connect_session_context_working_dir_wrapper'),
    $('#batch_connect_session_context_reservation_wrapper'),
    $('#batch_connect_session_context_custom_packages_wrapper'),
    $('#batch_connect_session_context_extra_packages_wrapper'),
    $('#batch_connect_session_context_bypass_custom_build_wrapper')
  ];

  $.each(wrappers, function(_, el) {
    if (show_advanced) {
      el.show();
    } else {
      el.hide();
    }
  });
}

$(document).ready(function() {
  // Always start collapsed, regardless of any value OOD cached from a
  // previous session.  The user should explicitly opt in to advanced options.
  $('#batch_connect_session_context_show_advanced').prop('checked', false);

  toggle_advanced_options();

  $('#batch_connect_session_context_show_advanced').on('change', toggle_advanced_options);

  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });

  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});
