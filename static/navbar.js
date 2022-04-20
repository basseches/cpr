$(document).ready(function(){

    $("form").submit(function( event ){
        event.preventDefault();
        submitSearch()
    });
})

function submitSearch() {

    let searched = $.trim($("#search").val())

    if (!(searched == "")) {

        let str = $("#search").val()
        window.location.replace("/search/" + str);

    }

}