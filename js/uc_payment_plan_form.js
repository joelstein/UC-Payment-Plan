jQuery(document).ready(function() {
	// Toggles payment plan fieldset if payment method is not credit
	$('input[id^=edit-panes-payment-payment-method-]').bind('click', function() {
		if ($('#edit-panes-payment-payment-method-credit').is(':checked')) {
			$('#payment_plan-pane').show();
		} else {
			$('#payment_plan-pane').hide();
		}
	}).triggerHandler('click');
});