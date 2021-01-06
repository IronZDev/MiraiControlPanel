$.get( "/connect", function() {
    console.log("Waiting to connect");
})
    .done(function(msg) {
        alert("Connection established");
        window.location.replace("/main");
    })
    .fail(function(msg) {
        alert("Could not connect to the botnet!");
        window.location.replace("/err");
    });