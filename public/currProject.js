ace.require("ace/ext/language_tools");

const theme = document.getElementById("theme-picker");
const pop_up = document.getElementById("popup-box-id");
const close_pop_up = document.getElementById("close-popup");
const auto_completion = document.getElementById("auto-completion")

close_pop_up.addEventListener('click', e => {
    pop_up.style.visibility = "hidden";
    aceEditor.style.zIndex = aceEditorIndex;
    marginEditor.style.zIndex = marginEditorIndex;
})

const load = (index) =>{
    console.log("Loading file with " + index )
    editor.setSession(sessions[index])
}

const settings = () => {
    aceEditor.style.zIndex = "-1";
    marginEditor.style.zIndex = "-1";
    pop_up.style.visibility = "visible";
}

const escapeHTML = (code) => {
    return code
    .replaceAll("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&quot;", '"')
    .replace("&#039;", "'")
    .replaceAll("&amp;", '&');
}

var loaded_code_element = document.getElementById("loaded-code");
var loaded_code = loaded_code_element.innerHTML.replaceAll("</div>", "").split("<div>"); loaded_code.shift();
var editor = ace.edit("editor");
var sessions = []

for (var i=0; i < loaded_code.length; i++) {
    sessions.push(ace.createEditSession(escapeHTML(loaded_code[i])));
}

loaded_code_element.remove();

editor.session.setMode("ace/mode/c_cpp");
editor.setTheme("ace/theme/tomorrow");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
})

const aceEditor = document.getElementById("editor");
const marginEditor = document.getElementsByClassName("ace_print-margin")[0];
const aceEditorIndex = aceEditor.style.zIndex; 
const marginEditorIndex = marginEditor.style.zIndex;


theme.addEventListener('change', e => {
    editor.setTheme("ace/theme/" + theme.value);
    editor.session.setMode("ace/mode/javascript");

})

document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.code === "KeyS")
    {
        editor.getValue();
        console.log("Post info to file")
        e.preventDefault();
    }
});
º