/**
 * Created by tyler on 10/9/14.
 */

$(function(){
   $('.message').slideDown();

   $('.message .message-close[data-close="message"]').click(function(){
        $(this).closest('.message').slideUp();
    });
});