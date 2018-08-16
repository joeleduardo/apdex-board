var layoutBtn = document.querySelector('#layoutBtn');
var content = document.querySelector('#content');
var label = document.querySelector('#layoutBtnTxt');

layoutBtn.addEventListener('change', function (e) {
  if (e.target.checked) {
    content.setAttribute('class', 'grid');
    label.innerText = 'Show as an awesome grid';
  } else {
    content.removeAttribute('class');
    label.innerText = 'Show as list';
  }
})