function Toggle() {
    var temp = document.getElementById('pw-entry');
    console.log(temp);
    if (temp.type === "password") {
        temp.type = "text";
    }
    else {
        temp.type = "password"
    }
}