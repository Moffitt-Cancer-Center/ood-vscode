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
 *   Two consequences:
 *     a) Hiding only the .form-group leaves the button visible.
 *     b) OOD's JS may run AFTER ours, so hiding on document.ready hides
 *        an element that doesn't exist yet — the button is inserted later
 *        and stays visible.
 *
 *   Fix: use nextUntil('.form-group') to capture all sibling elements
 *   between the working_dir form-group and the next form-group (which
 *   includes the button container regardless of OOD version). Also run a
 *   deferred toggle after a short delay so the button exists in the DOM.
 */
function toggle_advanced_options() {
  let show_advanced = $('#batch_connect_session_context_show_advanced').is(':checked');

  // Standard fields — hide/show via their .form-group ancestor
  let standard_groups = $()
    .add($('#batch_connect_session_context_auto_qos').closest('.form-group'))
    .add($('#batch_connect_session_context_auto_conda').closest('.form-group'))
    .add($('#batch_connect_session_context_v_version').closest('.form-group'))
    .add($('#batch_connect_session_context_reservation').closest('.form-group'))
    .add($('#batch_connect_session_context_custom_packages').closest('.form-group'))
    .add($('#batch_connect_session_context_extra_packages').closest('.form-group'))
    .add($('#batch_connect_session_context_bypass_custom_build').closest('.form-group'));

  // working_dir: hide the form-group AND every sibling element that follows
  // it before the next .form-group — this captures the path_selector button
  // container regardless of how OOD versions name or structure it.
  let wdir_group = $('#batch_connect_session_context_working_dir').closest('.form-group');
  let wdir_all   = wdir_group.add(wdir_group.nextUntil('.form-group'));

  if (show_advanced) {
    standard_groups.show();
    wdir_all.show();
  } else {
    standard_groups.hide();
    wdir_all.hide();
  }
}

$(document).ready(function() {
  // Initial toggle: hides standard form-groups immediately on page load.
  toggle_advanced_options();

  // Deferred toggle: OOD's path_selector JS injects the "Select Path" button
  // into the DOM in its own document.ready handler which may fire after ours.
  // Re-running after a short delay ensures the button exists and gets hidden.
  setTimeout(toggle_advanced_options, 250);

  // Re-evaluate whenever the checkbox changes.
  $('#batch_connect_session_context_show_advanced').on('change', toggle_advanced_options);

  $('#batch_connect_session_context_auto_conda').on('change', function() {
    console.log('Conda environment selected:', $(this).val());
  });

  $('#batch_connect_session_context_v_version').on('change', function() {
    console.log('VSCode version selected:', $(this).val());
  });
});

