function acces(){
var f = document.getElementById("form1");
f.addEventListener("submit",function(event){
    var user = document.getElementById("input1");
    var pass = document.getElementById("input2");
    var useracces = "azouz";
    var passacces = "1234";
    if(user.value == useracces && pass.value == passacces){
        
        location.replace("choice.html");
        event.preventDefault();
    }
    else{
        var error = document.getElementById("feedback");
        error.style.display = "block";
        event.preventDefault();


    }
});
}