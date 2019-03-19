/*
 *  Code is a little bit shitty right now
 *  No shit, What do you expect for a program that is made in just 3 days
 */
var ident;

function update(x){
    ident = x.dataset.id
    document.getElementById("upd").value = x.parentNode.parentNode.childNodes[0].innerHTML
    document.getElementById("updateForm").style.display = ''
}

function del(x){
    ident = x.dataset.id
    document.getElementById("deleteForm").style.display = ''
}

document.addEventListener("DOMContentLoaded", function(event){
    
    var jsonData = [];  //Temp empty json array

    document.getElementById("signin").addEventListener("click", function(event){
        event.preventDefault()
        blockstack.redirectToSignIn()
    })

    document.getElementById('signout').addEventListener('click', function(event) {
        event.preventDefault()
        document.getElementById("mainCRUD").style.display = 'none'
        blockstack.signUserOut(window.location.href)
    })

    if(blockstack.isUserSignedIn()) {
        document.getElementById("signout").style.display = ''
        document.getElementById("signin").style.display = 'none'
        document.getElementById("mainCRUD").style.display = ''
        const userData = blockstack.loadUserData().profile
        var person = new blockstack.Person(userData)
        document.getElementById("profileName").innerHTML = person.name() ? person.name() : "Set name in blockstacks profile"
        if (person.avatarUrl()){
            document.getElementById('profileID').setAttribute('src', person.avatarUrl())
        }
        blockstack.getFile("jsonData.json").then(function(file){
            jsonData = JSON.parse(file)
            var table = document.getElementById("bData")
            var idx = 0;
            jsonData.forEach(function(val){
                var row = table.insertRow()
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.className = "pv3 pr3 bb b--black-20"
                cell2.className = "pv3 pr3 bb b--black-20"
                cell1.innerHTML = val.message;
                cell2.innerHTML = "<a data-id=\""+ idx +"\" onclick=\"update(this)\" href=\"#\">Update</a> | <a onclick=\"del(this)\" data-id=\""+ idx +"\" href=\"#\"=>Delete</a>";
                idx++;
            })
            
        })

    } else if (blockstack.isSignInPending()) {
        blockstack.handlePendingSignIn().then(function(userData) {
            window.location = window.location.origin
        })
    } else {
        document.getElementById("signout").style.display = 'none'
    }

    document.getElementById("insert").addEventListener("click", function(event){
        event.preventDefault()
        document.getElementById("insert").disabled = true        
        jsonData.push({"message": document.getElementById("comment").value})
        
        blockstack.putFile("jsonData.json", JSON.stringify(jsonData)).then(function(){
            console.log("success entry of data")
            var table = document.getElementById("bData")
            var rowCount = table.rows.length; 
            while(--rowCount) table.deleteRow(rowCount);
            var idx = 0;
            jsonData.forEach(function(val){
                var row = table.insertRow()
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.className = "pv3 pr3 bb b--black-20"
                cell2.className = "pv3 pr3 bb b--black-20"
                cell1.innerHTML = val.message;
                cell2.innerHTML = "<a data-id=\""+ idx +"\" onclick=\"update(this)\" href=\"#\">Update</a> | <a onclick=\"del(this)\" data-id=\""+ idx +"\" href=\"#\"=>Delete</a>";
                idx++;
            })
            document.getElementById("insert").disabled = false        
        })
    })

    document.getElementById("confirmUpdate").addEventListener("click", function(event){
        event.preventDefault()
        jsonData[ident] = {
            "message": document.getElementById("upd").value
        }
        console.log(jsonData)

        // Too lazy to refactor this to a function, sorry about that 😴
        document.getElementById("confirmUpdate").disabled = true        
        blockstack.putFile("jsonData.json", JSON.stringify(jsonData)).then(function(){
            console.log("success update of data")
            document.getElementById("confirmUpdate").disabled = false        
            document.getElementById("updateForm").style.display = 'none'
            var table = document.getElementById("bData")
            var rowCount = table.rows.length; 
            while(--rowCount) table.deleteRow(rowCount);
            var idx = 0;
            jsonData.forEach(function(val){
                var row = table.insertRow()
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.className = "pv3 pr3 bb b--black-20"
                cell2.className = "pv3 pr3 bb b--black-20"
                cell1.innerHTML = val.message;
                cell2.innerHTML = "<a data-id=\""+ idx +"\" onclick=\"update(this)\" href=\"#\">Update</a> | <a onclick=\"del(this)\" data-id=\""+ idx +"\" href=\"#\"=>Delete</a>";
                idx++
            })
        })
    }) 

    document.getElementById("confirmDelete").addEventListener("click", function(event){
        event.preventDefault()
        jsonData.splice(ident, 1)
        document.getElementById("confirmDelete").disabled = true
        blockstack.putFile("jsonData.json", JSON.stringify(jsonData)).then(function(){
            console.log("success deletion and re-updating of data")
            document.getElementById("confirmDelete").disabled = false
            document.getElementById("deleteForm").style.display = 'none'
            var table = document.getElementById("bData")
            var rowCount = table.rows.length; 
            while(--rowCount) table.deleteRow(rowCount);
            var idx = 0;
            jsonData.forEach(function(val){
                var row = table.insertRow()
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.className = "pv3 pr3 bb b--black-20"
                cell2.className = "pv3 pr3 bb b--black-20"
                cell1.innerHTML = val.message;
                cell2.innerHTML = "<a data-id=\""+ idx +"\" onclick=\"update(this)\" href=\"#\">Update</a> | <a onclick=\"del(this)\" data-id=\""+ idx +"\" href=\"#\"=>Delete</a>";
                idx++
            })
        })
    })
    
    document.getElementById("cancelUpdate").addEventListener("click", function(){
        document.getElementById("upd").value = ''
        document.getElementById("updateForm").style.display = 'none'
    })

    document.getElementById("cancelDelete").addEventListener("click", function(){
        document.getElementById("deleteForm").style.display = 'none'
    })
})


