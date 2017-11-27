var json = JSON.stringify;
var ajax = function(endpoint, method, data, callback, contentType) {
    $.ajax({
        url: endpoint.startsWith('http') ? endpoint : 'api/' + endpoint,
        method: method,
        data: contentType === undefined ? json(data) : data,
        contentType: contentType === undefined ? 'application/json' : contentType,
        success: callback
    })
};

const GET = 'GET', POST = 'POST', PATCH = 'PATCH', PUT = 'PUT';
const TODOS = 'todos', PROJECTS = 'projects'

var API = {
    getProjects: function(callback) {
        ajax(PROJECTS, GET, null, callback)
    },
    getProject: function(project, callback) {
        ajax(project._links.self.href, GET, null, callback)
    },
    getProjectTodos: function(project, callback) {
        ajax(project._links.todos.href, GET, null, callback)
    },
    addProject: function(project, callback) {
        ajax(PROJECTS, POST, project, callback)
    },
    getTodos: function(callback) {
        ajax(TODOS, GET, null, callback)
    },
    addTodo: function(todo, callback) {
        ajax(TODOS, POST, todo, callback)
    },
    addTodoToProject: function(project, todo, callback) {
        ajax(project._links.todos.href, PATCH, todo._links.self.href, callback, 'text/uri-list')
    },
    removeTodoFromProject: function(project, todo, callback) {
        var newTodoList = ''
        this.getProjectTodos(project, function(body) {
            for(var i = 0; i < body._embedded.todos.length; i++) {
                if(body._embedded.todos[i]._links.self.href !== todo._links.self.href)
                    newTodoList += body._embedded.todos[i]._links.self.href + '\n'
            }
            ajax(project._links.todos.href, PUT, newTodoList, callback, 'text/uri-list')
        })
    },
    changeTodoStatus: function(link, status, callback) {
        ajax(link, PATCH, {
            status: status
        }, callback)
    },
    getTodosBetween: function(start, end, callback) {
        ajax(TODOS + '/search/findByDueDateBetween', GET, $.param({
            before: start,
            after: end
        }), callback, "text/plain")
    }
};