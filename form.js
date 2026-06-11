'use strict'

/**
 * Toggle visibility of advanced options based on checkbox state.
 *
 * NOTE on working_dir / path_selector:
 *   OOD renders the path_selector widget as TWO separate DOM elements:
 *     1. The text input inside a standard .form-group
 *     2. The "Select Path" button in a SIBLING container outside that
 *        .form-group, injected by OOD's own JavaScript at page load.
 *
 *   Problem: OOD's path_selector JS runs in its own document.ready and
 *   injects the button AFTER ours runs, so the button doesn't exist yet
 *   when we call hide() on page load.
 *
 *   Fix: use a MutationObserver that watches for the button being added to
 *   the DOM, hides it immediately if advanced options are collapsed, and
 *   then disconnects. This is a one-time observer and never interferes with
 *   user-triggered toggles.
 *
 *   Do NOT use setTimeout for this — a timer that re-runs toggle_advanced_options
 *   after page load will race against user interaction and can override a
 *   hide the user just triggered, making re-hiding appear broken.
 */

function toggle_advanced_options() {
  let show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');

  // Each call rebuilds the selector set from current DOM state.
  let auto_qos_group             = $('#batch_connect_session_context_auto_qos').closest('.form-group');
  let auto_conda_group           = $('#batch_connect_session_context_auto_conda').closest('.form-group');
  let v_version_group            = $('#batch_connect_session_context_v_version').closest('.form-group');
  let reservation_group          = $('#batch_connect_session_context_reservation').closest('.form-group');
  let custom_packages_group      = $('#batch_connect_session_context_custom_packages').closest('.form-group');
  let extra_packages_group       = $('#batch_connect_session_context_extra_packages').closest('.form-group');
  let bypass_custom_build_group  = $('#batch_connect_session_context_bypass_custom_build').closest('.form-group');

  // working_dir: form-group (text input) + any siblings before the next
  // .form-group — the path_selector button container lives in that gap.
  let wdir_group    = $('#batch_connect_session_context_working_dir').closest('.form-group');
  let wdir_siblings = wdir_group.nextUntil('.form-group');

  if (show_advanced) {
    auto_qos_group.show();
    auto_conda_group.show();
    v_version_group.show();
    wdir_group.show();
    wdir_siblings.show();
    reservation_group.show();
    custom_packages_group.show();
    extra_packages_group.show();
    bypass_custom_build_group.show();
  } else {
    auto_qos_group.hide();
    auto_conda_group.hide();
    v_version_group.hide();
    wdir_group.hide();
    wdir_siblings.hide();
    reservation_group.hide();
    custom_packages_group.hide();
    extra_packages_group.hide();
    bypass_custom_build_group.hide();
  }
}

$(document).ready(function() {
  // Hide/show on page load based on current checkbox state.
  toggle_advanced_options();

  // MutationObserver: fires once when OOD's path_selector JS injects the
  // "Select Path" button container into the DOM (a sibling of wdir_group).
  // Immediately applies the correct visibility and then disconnects so it
  // never interferes with subsequent user interactions.
  var observer = new MutationObserver(function(mutations, obs) {
    var wdir_group    = $('#batch_connect_session_context_working_dir').closest('.form-group');
    var wdir_siblings = wdir_group.nextUntil('.form-group');
    if (wdir_siblings.length > 0) {
      obs.disconnect();
      var show = $('#batch_connect_session_context_show_advanced').is(':checked');
      wdir_siblings[show ? 'show' : 'hide']();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Re-evaluate on every checkbox change.
  $('#batch_connect_session_context_show_advanced').on('change', toggle_advanced_options);

  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });

  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});

