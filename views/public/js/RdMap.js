
    
 if(data.approval !=="aproved" && data.filltype === "Rock fill"){
    document.querySelector("div").addEventListener("click", function(){
        background = "red"
    })     

 
 RdMap.forEach(function(data){
    if(data.approval !=="aproved" && data.filltype === "Rock fill"){
        $("div").css("background", "grey")   
    
    }else if(data.approval !=="aproved" && data.filltype === "G3"){
        $("div").css("background", "brown")    
    
    }else if(data.approval !=="aproved" && data.filltype === "G7"){
        $("div").css("background", "yellow")    
    
    }else if(data.approval !=="aproved" && data.filltype === "G15"){
        $("div").css("background", "blue")    
    
    }else if(data.approval !=="aproved" && data.filltype === "sub base"){
        $("div").css("background", "green")    
    
    }else {
        $("div").css("background", "red")    
    
    }
    
 })

var logtag = document.querySelector("#log")
var regtag = document.querySelector("#reg")
var homtag = document.querySelector("#hom")
var dattag = document.querySelector("#dat")
var instag = document.querySelector("#ins")
var abttag = document.querySelector("#abt")
var loogtag = document.querySelector("#loog")

logtag.addEventListener("click", function(){
    logtag.classList.remove("selected");
    regtag.classList.remove("selected");
    homtag.classList.remove("selected");
    dattag.classList.add("selected");
    instag.classList.remove("selected");
    abttag.classList.remove("selected");
    loogtag.classList.remove("selected");
    })

regtag.addEventListener("click", function(){
    logtag.classList.remove("selected");
    regtag.classList.add("selected");
    homtag.classList.remove("selected");
    dattag.classList.remove("selected");
    instag.classList.remove("selected");
    abttag.classList.remove("selected");
    loogtag.classList.remove("selected");
    
    })

    homtag.addEventListener("click", function(){
        logtag.classList.remove("selected");
        regtag.classList.remove("selected");
        homtag.classList.add("selected");
        dattag.classList.remove("selected");
        instag.classList.remove("selected");
        abttag.classList.remove("selected");
        loogtag.classList.remove("selected");
        
        })

        dattag.addEventListener("click", function(){
            logtag.classList.remove("selected");
            regtag.classList.remove("selected");
            homtag.classList.remove("selected");
            dattag.classList.dat("selected");
            instag.classList.remove("selected");
            abttag.classList.remove("selected");
            loogtag.classList.remove("selected");
            
            })

            instag.addEventListener("click", function(){
                logtag.classList.remove("selected");
                regtag.classList.remove("selected");
                homtag.classList.remove("selected");
                dattag.classList.remove("selected");
                instag.classList.add("selected");
                abttag.classList.remove("selected");
                loogtag.classList.remove("selected");
                
                })

                abttag.addEventListener("click", function(){
                    logtag.classList.remove("selected");
                    regtag.classList.remove("selected");
                    homtag.classList.remove("selected");
                    dattag.classList.remove("selected");
                    instag.classList.remove("selected");
                    abttag.classList.add("selected");
                    loogtag.classList.remove("selected");
                    
                    })

                    loogtag.addEventListener("click", function(){
                        logtag.classList.remove("selected");
                        regtag.classList.remove("selected");
                        homtag.classList.remove("selected");
                        dattag.classList.remove("selected");
                        instag.classList.remove("selected");
                        abttag.classList.remove("selected");
                        loogtag.classList.add("selected");
                        
                        })