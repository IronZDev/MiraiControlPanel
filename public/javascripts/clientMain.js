let selectValid = false;
let targetIPValid = false;
let attackDurationValid = false;
let isAttackStarted = false;
//input mask bundle ip address
const targetIP = $('#targetIP');
targetIP.inputmask({
    alias: "ip",
    greedy: false //The initial mask shown will be "" instead of "-____".
});

const attackDuration = $('#attackDuration');
attackDuration.inputmask({
    alias: "datetime",
    inputFormat: "MM:ss",
    greedy: false
});

function checkValidity() {
    if(selectValid && targetIPValid && attackDurationValid && !isAttackStarted) {
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

attackDuration.on('change', function () {
    attackDurationValid = !!this.value.match(/\d{2}:\d{2}/);
    checkValidity();
});

$('#startAttackForm').ajaxForm({
    beforeSubmit: function () {
        isAttackStarted = true;
        checkValidity();
    },
    success : function (responseText, statusText) {
        isAttackStarted = false;
        checkValidity();
        alert("Attack started!");
    },
    error: function (response) {
        console.log(response);
        isAttackStarted = false;
        checkValidity();
        alert(response.responseText);
        window.location.replace("/err");
    }
});