var steps = [
    "find an AED",
    "begin manual CPR",
    "use AED",
    "call 911"
]

//"non-ppc-elements"
// a list of divs 
stepsDivs = []
answerDivs = []
function initializationN(stepsDivs){
    $(".steps-div").empty()
    $.each(steps, function(index, value) {
        var html_output_element = "<div class='non-ppc-html-output' data-value="+value+">"+ value +"</div>"
        $(".steps").append(html_output_element);
    })
    $(".steps").draggable({
        revert: function(stepObject){
                if(stepObject == true){
                    return false
                }
                else {
                    return true
                }
            }
    })
}
function initializationP(answerDivs){
    $(".answers").empty()
    $.each(answerDivs, function(index, value) {
        var text = (index + 1) + " " + value
        var html_output_element = "<div class='ppc-html-output' data-value="+value+">"+text+"</div>"
        
        $(".ppc-elements").append(html_output_element);
    })
    $(".ppc-html-output").draggable({
        revert: function(employeeObject){
                if(employeeObject=== true){
                    return false
                }
                else {
                    return true
                }
            }
    })
}



$(document).ready(function(){
    initializationN(employeeDivs) // initiliaztion of list 
    $(".non-ppc-html-output").draggable({
        revert: function(employeeObject){
                if(employeeObject=== true){
                    return false
                }
                else {
                    return true
                }
            }
    })
    $(".ppc-html-output").draggable({
        revert: function(employeeObject){
                if(employeeObject=== true){
                    return false
                }
                else {
                    return true
                }
            }
    })
    $("#Non-PPC").droppable({
        accept: ".ppc-html-output", classes:{
            "ui-droppable-active": "active-class",
            "ui-droppable-hover" : "hover-class"
            
        },
        drop: function(event, ui){
            var nameDrop = $(ui.draggable[0]).data("value")
            var nameDropIndex = employeePPCDivs.indexOf(nameDrop)
            employeePPCDivs.splice(nameDropIndex, 1)
            employees.push(nameDrop)
            initializationN(employees)
            initializationP(employeePPCDivs)
        }


    })

     $("#PPC").droppable({
        accept: ".non-ppc-html-output", classes:{
            "ui-droppable-active": "active-class",
            "ui-droppable-hover" : "hover-class"
            
        },
        drop: function(event, ui){
            var nameDrop = $(ui.draggable[0]).data("value")
            var nameDropIndex = employees.indexOf(nameDrop)
            employees.splice(nameDropIndex, 1)
            employeePPCDivs.push(nameDrop)
            initializationP(employeePPCDivs)
            initializationN(employeeDivs)
        }
     })
});