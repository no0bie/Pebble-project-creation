console.log('client started')

const currRadioButton = () => {
  if (document.getElementById('c').checked) {
    document.getElementById('c-options').style.visibility = 'visible';
  }
  else {
    document.getElementById('c-options').style.visibility = 'hidden';
    document.getElementById('js').checked = false;
    document.getElementById('simple').checked = false;
  }
}

const popUpClose = document.getElementById('close-popup');
const createProject = document.getElementById('create-project');
const popUpBox = document.getElementById('popup-box-id');
const cOptions = document.getElementById('c-options');

createProject.addEventListener('click', e => {
  popUpBox.style.visibility = 'visible';
})

popUpClose.addEventListener('click', e => {
  popUpBox.style.visibility = 'hidden';
  cOptions.style.visibility = 'hidden';
})