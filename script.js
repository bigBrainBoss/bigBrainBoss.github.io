let app = Vue.createApp({
    data: () => ({
        vars: {
            finalTodos: [],
            conditions: {
                isEditing: false,
                popupIsOpen: false,
                searchIsOpen: false,
                loginIsOpen: false,
                registerIsOpen: false,
                showOnlyChecked: false,
                showOnlyStarred: false,
                showOnlyPinned: false,
                isLoginInvalid: false,
                isRegisterInvalid: false,
            },
            values: {
                selectedItemIndex: null,
                inputValue: '',
                searchValue: '',
                loginUsernameValue: '',
                loginPasswordValue: '',
                registerUsernameValue: '',
                registerPasswordValue: '',
            },
            stats: {
                todosNumber: null,
                starredTodosNumber: null,
                pinnedTodosNumber: null,
                notStarredTodosNumber: null,
                notPinnedTodosNumber: null,
                notStarredPinnedTodosNumber: null,
                starredAndPinnedTodosNumber: null,
                checkedTodosNumber: null,
                uncheckedTodosNumber: null,
                checkedStarredTodosNumber: null,
                uncheckedStarredTodosNumber: null,
            },
        },
        /* only 'todos' is connected to database, others are just variables */
        todos: [{todoValue: 'hi', starred: false, pinned: false, checked: false, bgColor: 'rgb(200,200,120)'}],
    }),
    created() {
        this.vars.finalTodos = this.todos.filter(obj => {return obj.pinned})
        this.vars.finalTodos = this.vars.finalTodos.concat(this.todos.filter((item) => this.vars.finalTodos.indexOf(item) < 0))
    },
    methods: {
        login() {
            if (this.vars.values.loginUsernameValue === '' || !/^[0-9a-zA-Z_.-]+$/.test(this.vars.values.loginUsernameValue) || this.vars.values.loginPasswordValue === '' || !/^[0-9a-zA-Z_.-]+$/.test(this.vars.values.loginPasswordValue)) {
                this.vars.conditions.isLoginInvalid = true
            } else {
                this.vars.conditions.loginIsOpen = false
                /* database check and enter */
            }
        },
        register() {
            if (this.vars.values.registerUsernameValue === '' || !/^[0-9a-zA-Z_.-]+$/.test(this.vars.values.registerUsernameValue) || this.vars.values.registerPasswordValue === '' || !/^[0-9a-zA-Z_.-]+$/.test(this.vars.values.registerPasswordValue)) {
                this.vars.conditions.isRegisterInvalid = true
            } else {
                this.vars.conditions.registerIsOpen = false
                /* database check and enter */
            }
        },
        addItem() {
            this.$refs.inputField.focus()
            if (this.vars.values.inputValue !== '') {
                this.todos.push({todoValue: this.vars.values.inputValue, starred: false, pinned: false, checked: false, bgColor: this.getColor()});
                this.vars.values.inputValue = '';
            }
            this.smthChanged()
        },
        deleteItem(index) {
            this.todos.splice(this.todos.indexOf(this.vars.finalTodos[index]), 1)
            this.smthChanged()
        },
        editItem(index, todoValue) {
            this.vars.conditions.isEditing = true
            this.vars.values.inputValue = todoValue
            this.vars.values.selectedItemIndex = this.todos.indexOf(this.vars.finalTodos[index])
            this.$nextTick(() => {
                this.$refs.inputField.focus();
            });
        },
        updateItem() {
            if (this.vars.values.inputValue !== '') {
                this.todos[this.vars.values.selectedItemIndex].todoValue = this.vars.values.inputValue
                this.vars.values.inputValue = ''
                this.vars.conditions.isEditing = false
            }
            this.$nextTick(() => {
                this.$refs.inputField.focus();
            });
            this.smthChanged()
        },
        clearInput() {
            this.$refs.inputField.focus()
            this.vars.values.inputValue = ''
        },
        clearSearch() {
            this.vars.values.searchValue = ''
        },
        getColor() {
            var colors = []
            colors.push(120+(Math.floor(Math.random() * 100)))
            colors.push(120+(Math.floor(Math.random() * 100)))
            colors.push(120+(Math.floor(Math.random() * 100)))
            return "rgb("+(colors[0]).toString()+","+(colors[1]).toString()+","+(colors[2]).toString()+")"
        },
        smthChanged() {
            var almostFinalTodos = this.todos
            if (this.vars.conditions.showOnlyPinned) {
                almostFinalTodos = this.todos.filter(obj => {return obj.pinned})
            } else if (this.vars.conditions.showOnlyChecked) {
                almostFinalTodos = this.todos.filter(obj => {return obj.checked})
            }
            if (this.vars.conditions.showOnlyStarred) {
                almostFinalTodos = almostFinalTodos.filter(obj => {return obj.starred})
            }
            if (this.vars.values.searchValue !== '') {
                almostFinalTodos = almostFinalTodos.filter(obj => {return obj.todoValue.includes(this.vars.values.searchValue)})
            }
            this.vars.finalTodos = almostFinalTodos.filter(obj => {return obj.pinned})
            this.vars.finalTodos = this.vars.finalTodos.concat(almostFinalTodos.filter((item) => this.vars.finalTodos.indexOf(item) < 0))
        },
        openPopup() {
            this.vars.stats.todosNumber = this.todos.length
            this.vars.stats.starredTodosNumber = this.todos.filter(obj => {return obj.starred}).length
            this.vars.stats.pinnedTodosNumber = this.todos.filter(obj => {return obj.pinned}).length
            this.vars.stats.notStarredTodosNumber = this.todos.filter(obj => {return !obj.starred}).length
            this.vars.stats.notPinnedTodosNumber = this.todos.filter(obj => {return !obj.pinned}).length
            this.vars.stats.notStarredPinnedTodosNumber = this.todos.filter(obj => {return (!obj.starred && !obj.pinned)}).length
            this.vars.stats.starredAndPinnedTodosNumber = this.todos.filter(obj => {return (obj.starred && obj.pinned)}).length
            this.vars.stats.checkedTodosNumber = this.todos.filter(obj => {return obj.checked}).length
            this.vars.stats.uncheckedTodosNumber = this.todos.filter(obj => {return !obj.checked}).length
            this.vars.stats.checkedStarredTodosNumber = this.todos.filter(obj => {return (obj.starred && obj.checked)}).length
            this.vars.stats.uncheckedStarredTodosNumber = this.todos.filter(obj => {return (obj.starred && !obj.checked)}).length
        },
    }
});

app.mount("#app");

var inputArea = document.querySelector('.input-area');
var inputAreaTop = (inputArea.offsetTop) - 60;

function isStuck() {
    if (window.pageYOffset >= inputAreaTop) {
        inputArea.classList.add('stuck');
    } else {
        inputArea.classList.remove('stuck');
    }
};