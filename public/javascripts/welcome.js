const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


const welcomeUtils = {
    createProject: function () {
        fetch('/getAutomatons', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                response.json()
                    .then(res => {
                        if (res.error) {
                            throw new Error(res.error.name);
                        } else {
                            /* Swal.fire({
                                icon: 'success',
                                title: `Користувача ${res.data.name} успішно додано`,
                                confirmButtonText: '<a href="/welcome">Чудово</a>'
                            }) */
                            console.log(res)
                            let select = document.createElement('select');
                            select.classList.add('swal2-select');
                            select.style = 'display: flex;';
                            select.id = 'automaton'
                            res.forEach(automaton => {
                                let option = document.createElement('option');
                                option.value = automaton._id;
                                option.innerText = automaton.name;
                                select.appendChild(option)
                            })

                            var wrap = document.createElement('div');
                            wrap.appendChild(select.cloneNode(true));
                            let selectHtml = wrap.innerHTML;

                            Swal.fire({
                                title: 'Cтворення проекта',
                                icon: 'info',
                                html:
                                    `
                                    <label for="my-input">Назва</label>
                                    <input id="name" class="swal2-input">
                                    <label for="my-input">Діаграма станів</label>
                                    ${selectHtml}
                                    `,
                                focusConfirm: false,
                                showLoaderOnConfirm: true,
                                preConfirm: () => {
                                    let newProject = {
                                        name: document.getElementById('name').value,
                                        automaton: document.getElementById('automaton').value,
                                    }
                                    return fetch('/createProject', {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        method: 'POST',
                                        body: JSON.stringify(newProject)
                                    })
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error(response.statusText)
                                            }
                                            return response.json()
                                                .then(res => {
                                                    if (res.error) {
                                                        console.log()
                                                        throw new Error(res.error.name);
                                                    } else {
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: `Проект ${res.data.name} успішно створено`,
                                                            confirmButtonText: '<a href="/welcome">Чудово</a>'
                                                        })
                                                        return res.data;
                                                    }
                                                })
                                                .catch(error => {
                                                    Swal.showValidationMessage(
                                                        `Помилка запиту: ${error}`
                                                    )
                                                })
                                        })
                                        .catch(error => {
                                            Swal.showValidationMessage(
                                                `Помилка: ${error}`
                                            )
                                        })
                                }
                            })
                        }
                    })
                    .catch(error => {
                        Toast.fire({
                            icon: 'error',
                            title: error
                        })
                    })
            })
            .catch(error => {
                Toast.fire({
                    icon: 'error',
                    title: error
                })
            })
    }
}