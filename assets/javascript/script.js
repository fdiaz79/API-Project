$(document).ready(function(){
    var rockBandArr = JSON.parse(localStorage.getItem("rockbandlist"));
    var qtyArr = JSON.parse(localStorage.getItem("qtylist"));
    
    var pVar = $("<p>");
    var dbSpan = $("#db-span");
    
    pVar.text("Click on the rock band button to generate the gifs. If you don't see the desired band button, please create it in the CREATORS PANEL. If you want to delete one band button, please activate the option in the CREATORS PANEL and the click on the button to be eliminated, after that, deactivate the option again.")
    dbSpan.text("DISABLED");
    
    if (!Array.isArray(rockBandArr)){
        rockBandArr = [];
    };
    if (!Array.isArray(qtyArr)){
        qtyArr = [];
    };

    renderButtons();
    

    function renderButtons (){
        for (var i = 0; i < rockBandArr.length; i++){
            
            
            var but = $("<button>");
            but.text(rockBandArr[i]);
            but.attr("data-name", rockBandArr[i]);
            but.attr("data-qty", qtyArr[i]);
            but.attr("data-toggle", "tooltip");
            but.attr("data-placement", "top");
            but.attr("title", qtyArr[i] + " gifs per click");
            but.addClass("buttonGen");
            $("#buttons-panel").append(but);
            
        }
        $("#buttons-panel").append(pVar);
    };

    $("#add-button").on("click", function(event){
        event.preventDefault();
        var bandName = $("#bandInput").val().trim();
        var qty = $("#gifQuantity").val().trim();

        rockBandArr.push(bandName);
        qtyArr.push(qty);

        console.log(rockBandArr);
        console.log(qtyArr);
        $("#buttons-panel").empty();
        renderButtons();

        localStorage.setItem("rockbandlist", JSON.stringify(rockBandArr));
        localStorage.setItem("qtylist", JSON.stringify(qtyArr));

        $("#bandInput").val("");
        $("#gifQuantity").val("1");

    });

    

    
    $(document).on("click", ".buttonGen", function(){
        if ($("#delete-buttons").is(':checked')) {
            
            var band = $(this).attr("data-name");
            var index = rockBandArr.indexOf(band);
            if (index!==-1) {
                rockBandArr.splice(index,1);
                qtyArr.splice(index,1);
                localStorage.setItem("rockbandlist", JSON.stringify(rockBandArr));
                localStorage.setItem("qtylist", JSON.stringify(qtyArr));
            }
            $(this).remove();
            

        } else{  
            var band = $(this).attr("data-name");
            var quantity = $(this).attr("data-qty");
            var queryURL = "https://api.giphy.com/v1/gifs/search?q="+band+"&api_key=45cT8QQLb5NITkpIqDKk64Kw3FNL0bw7&limit="+quantity;

            
            console.log(queryURL);

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response){
                var results = response.data;

                for (var j = 0; j < results.length; j++){
                    var divVar = $("<div>");
                    divVar.addClass("col-6 col-sm-4 col-md-2");
                    
                    var figVar = $("<figure>");
                    var imgVar = $("<img>");
                    var capVar = $("<fig-caption>");

                    imgVar.addClass("figure-img img-fluid rounded gif-img");
                    imgVar.attr("src", results[j].images.downsized_still.url);
                    imgVar.attr("data-still", results[j].images.downsized_still.url);
                    imgVar.attr("data-animated", results[j].images.downsized.url);
                    imgVar.attr("data-state", "still");

                    capVar.addClass("figure-caption text-center");
                    capVar.text("Rating: "+ results[j].rating);

                    figVar.append(imgVar);
                    figVar.append(capVar);

                    divVar.append(figVar);

                    $("#gif-display").prepend(divVar); 
                }
                var titleVar = $("<div>");
                titleVar.addClass("col-12");
                titleVar.text("Showing gifs for " + band);

                $("#gif-display").prepend(titleVar);
            });
        };
    });
    

    $(document).on("click", ".gif-img", function(){
        var dataState = $(this).attr("data-state");
        var dataAnimated = $(this).attr("data-animated");
        var dataStill = $(this).attr("data-still");
        console.log(dataState);
        console.log(dataAnimated);
        console.log(dataStill);

        if (dataState == "still") {
            $(this).attr("src", dataAnimated);
            $(this).attr("data-state", "animated");
        } else{
            $(this).attr("src", dataStill);
            $(this).attr("data-state", "still");
        };
    });

    $("#delete-buttons").change(function(){
        
        if ($("#delete-buttons").is(':checked')) {
            dbSpan.css("color","red");
            dbSpan.text("ENABLED");
            
        }
        else{
            dbSpan.css("color","#007bff");
            dbSpan.text("DISABLED");
        }
    });

});