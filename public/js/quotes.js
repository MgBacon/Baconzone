$(function(){
    $.AJAX({
        //url: 'localhost:3000/api/v1/quotes',
        url: '192.168.0.17/api/v1/quotes',
        type: 'GET',
        success : function(data) {
            chartData = data;
            console.log(data);
            var template = Handlebars.compile($("#tabular-template").html());
            $("#table-location").html(template(data));
        }
        
    });
});
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}