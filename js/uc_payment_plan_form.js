jQuery(document).ready(function($) {

  // Toggles payment plan fieldset if payment method is not credit.
  $('input[id^=edit-panes-payment-payment-method-]').click(function() {
    if ($('#edit-panes-payment-payment-method-credit').is(':checked')) {
      $('#payment_plan-pane').show();
    } else {
      $('#payment_plan-pane').hide();
    }
  }).triggerHandler('click');

  // Setup initial table data from settings.
  $.each([100, 50, 25], function(i, option) {
    $('#payment-plan-table .option' + option + ' .down-payment').html(Drupal.settings.ucPaymentPlan.data[option].down_payment);
    $('#payment-plan-table .option' + option + ' .installments').html(Drupal.settings.ucPaymentPlan.data[option].installments);
    $('#payment-plan-table .option' + option + ' .payment-plan-total').html(Drupal.settings.ucPaymentPlan.data[option].payment_plan_total);
    $('#payment-plan-table .option' + option + ' .fees').html(Drupal.settings.ucPaymentPlan.data[option].fees);
  });

  // Ugh. Since Ubercart doesn't have any way to "hook" into the "order total
  // preview" updates, we periodically check the order total for changes, so we
  // can keep the payment plan table up-to-date.
  var last_order_total = $('#uc-order-total-preview .uc-price:last').text();
  setInterval(function(){
    if (last_order_total != $('#uc-order-total-preview .uc-price:last').text()) {
      last_order_total = $('#uc-order-total-preview .uc-price:last').text();
      updatePaymentPlanData();
    }
  }, 500);

  // Sends the serialized order back to the server (uses serializeOrder() from
  // UC Payment), which calculates and formats the new totals, which are then
  // shown in the table.
  function updatePaymentPlanData() {
    $.ajax({
      url: Drupal.settings.ucPaymentPlan.callback,
      data: {order: serializeOrder()},
      dataType: 'json',
      type: 'POST',
      success: function(data) {
        $.each([100, 50, 25], function(i, option) {
          $('#payment-plan-table .option' + option + ' .down-payment').html(data[option].down_payment);
          $('#payment-plan-table .option' + option + ' .installments').html(data[option].installments);
          $('#payment-plan-table .option' + option + ' .payment-plan-total').html(data[option].payment_plan_total);
          $('#payment-plan-table .option' + option + ' .fees').html(data[option].fees);
        });
      }
    });
  }

});
