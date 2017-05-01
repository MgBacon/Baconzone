function escapeHtml(unsafe) {
    if(typeof unsafe!=="string"){
        unsafe=unsafe.toString();
    }
        return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
function clearQuoteTable() {
    $("#quoteTable tr").remove();
}
function getAllQuotes (){
    clearQuoteTable();
    $.get("/api/v1/quotes",function(data,status,xhr){            
        var quotes=data.quotes;
        for(var i=0;i<quotes.length;i++){
            var row="<tr><td>"+escapeHtml(quotes[i].id)+"</td><td>"+escapeHtml(quotes[i].quote)+"</td><td>"+escapeHtml(quotes[i].author)+"</td><td>"+escapeHtml(quotes[i].year)+"</td></tr>";                
            $("#quoteTable").append(row);
        }
    });
}

function addQuote() {
    var param=$('#quoteAdd').serialize();
    console.log(param);
    var http = new XMLHttpRequest();
    var url = "/api/v1/quotes";
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4) {
            var data = JSON.parse(http.responseText);
            console.log(data)
            if(data.success){
                $.alert('Quote added successfully',{
                    autoClose: true,
                    closeTime: 2000,
                    type:'success',
                    position: ['center', [-250,0]],
                    close:""
                });
                clearQuoteTable();
                getAllQuotes();
            }else{
                $.alert(data.data,{
                autoClose: true,
                closeTime: 4000,
                type:'danger',
                position: ['center', [-250,0]],
                close:""
                });
            }
        }
    }
    http.send(param);
}
function getRandomQuote() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", '/api/v1/quotes/random',false); // false for synchronous request
        xmlHttp.send();            
        var data = JSON.parse(xmlHttp.responseText);
        var quote=data.quotes[0];    
        var quoteString=escapeHtml(quote.quote+" - "+quote.author+" "+quote.year);
        if(document.getElementById('quote').innerHTML==quoteString){
            getRandomQuote();
            return;
        }
        document.getElementById('quote').innerHTML = quoteString;
}