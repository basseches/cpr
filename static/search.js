$(document).ready(function(){

    display_search(titles, content, num, searched)

});

function display_search(titles, content, num, searched){

    if (num == 0) {
        let results = $("<div class='subheaderFont'>No results found.</div>")
        $("#searched").append(results)
    } else {

        if (num == 1) {
            let results = $("<div class='subheaderFont'>1 result found.</div>")
            $("#searched").append(results)
        } else {
            let results = $("<div class='subheaderFont'>" + num + " results found.</div>")
            $("#searched").append(results)
        }

        let titlediv = $("<div class='alata mediumText'>Title search results:</div>")
        $("#title").append(titlediv)
        searchTitle(titles)

        let contentdiv = $("<div class='alata mediumText'>Content search results:</div>")
        $("#content").append(contentdiv)
        searchContent(content)

    }

}

function searchTitle(listy) {

    for (const value of listy) {
        $("#tresult").append(value)
    }

}

function searchContent(listy) {

    for (const value of listy) {
         
        $("#cresult").append(value)
    }

}