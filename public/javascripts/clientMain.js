//input mask bundle ip address
$(document).ready(function() {
    const ipv4_address = $('#targetIP');
    ipv4_address.inputmask({
        alias: "ip",
        greedy: false //The initial mask shown will be "" instead of "-____".
    });
});

console.log("Loaded")