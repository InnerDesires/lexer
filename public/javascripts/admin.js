const adminUtils = {
    addUser: function () {
        Swal.fire({
            title: 'Додавання студента',
            icon: 'info',
            html:
                `<label for="my-input">Електронна пошта</label>
                <input id="email" class="swal2-input">
                <label for="my-input">Ім'я та Прізвище</label>
                <input id="name" class="swal2-input">
                <label for="my-input">Група</label>
                <input id="group" class="swal2-input">
                <label for="my-input">Пароль</label>
                <input id="password" class="swal2-input">
                <label for="my-input">Роль</label>
                <input id="role" class="swal2-input">
                `,
            focusConfirm: false,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                let newStudent = {
                    email: document.getElementById('email').value,
                    name: document.getElementById('name').value,
                    group: document.getElementById('group').value,
                    password: document.getElementById('password').value,
                    role: document.getElementById('role').value,
                }
                return fetch('/createUser', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(newStudent)
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
                                        title: `Користувача ${res.data.name} успішно додано`
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
    },
    addAutomaton: function () {
        Swal.fire({
            title: 'Додавання Автомата',
            icon: 'info',
            html:
                `
                <label for="my-input">Назва</label>
                <input id="name" class="swal2-input">
                <label for="my-input">JSON Автомата</label>
                <textarea style="display: flex;" id="automata" class="swal2-textarea"></textarea>
                <label for="my-input">Текстове подання</label>
                <textarea style="display: flex;" id="textForm" class="swal2-textarea"></textarea>
                <label for="my-input">Тестовий код за замовчуванням</label>
                <textarea style="display: flex;" id="testCode" class="swal2-textarea"></textarea>
                `,
            focusConfirm: false,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                let newAutomata = {
                    json: document.getElementById('automata').value,
                    name: document.getElementById('name').value,
                    testCode: document.getElementById('testCode').value,
                    textForm: document.getElementById('textForm').value,
                }
                return fetch('/createAutomaton', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(newAutomata)
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
                                        title: `Автомат ${res.data.name} успішно додано`
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
}
