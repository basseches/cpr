function display_page(){
    $.each(learningMaterial, function(index, value){
        if(value["id"] == title){
            console.log(value)
            var title_div = "<div>" + value["title"] + "</div>"
            $("#title").append(title_div);
            for (txt of value["explanatoryText"]){
                var text_div = "<div>" + txt + "</div>"
                $("#text").append(text_div);
            }
            
            for(image of value["images"]){
                console.log(image)
                var image_div = "<div><img src= '"+image+"'></div>"
                $("#images").append(image_div);
            }
            var button_div = "<div><button type ='button'>"+learningMaterial[index + 1]+"</button>"
            $("#nextbutton").append(button_div)
        }
    })
}

$(document).ready(function(){
    display_page()
})