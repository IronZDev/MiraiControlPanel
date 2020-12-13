let selectValid = false;
let targetIPValid = false;
//input mask bundle ip address
const targetIP = $('#targetIP');
targetIP.inputmask({
    alias: "ip",
    greedy: false //The initial mask shown will be "" instead of "-____".
});

function checkValidity() {
    if(selectValid && targetIPValid) {
        $('#attackBtn').removeAttr('disabled');
    } else {
        console.log("disable");
        $('#attackBtn').attr('disabled', true);
    }
}

$('#attackSelect').on('change', function() {
    selectValid = this.value !== 0;
    checkValidity();
});

targetIP.on('change', function() {
    targetIPValid = !!this.value.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
    checkValidity();
});