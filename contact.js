const inputs = document.querySelectorAll('.user_input');
inputs.forEach(i => {
    i.value = '';
})

const test = (e) => {
    if(e.target.value) {
        e.target.classList.add('filled');
    } else {
        e.target.classList.remove('filled');
    }
}

inputs.forEach(e => {
    e.addEventListener('change', test);
});
