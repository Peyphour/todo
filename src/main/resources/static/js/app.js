var APP = {
    projectLoadStatus: [],
    projects: new Map(),
    currentProject: {},
    priorityValues: {
        'LOW': 0,
        'NORMAL': 1,
        'HIGH': 2
    },

    processTemplate: function (container, template_name, data) {
        $('#' + container).html(Handlebars.compile($('#' + template_name).html())(data))
    },
    sortTodos: function(a, b) {
        if(moment(a.dueDate).isBefore(b.dueDate, 'day')) {
            return -1
        } else if(moment(a.dueDate).isAfter(b.dueDate, 'day')){
            return 1
        }
        if(moment(a.dueDate).isSame(b.dueDate, 'day')) {
            return APP.priorityValues[b.priority] - APP.priorityValues[a.priority]
        }
    },
    init: function() {
        location.hash = ''
        window.onhashchange = APP.dispatch
        APP.dispatch()
        Handlebars.registerHelper("equals", function(a, b, opts) {
            if(a === b) // Or === depending on your needs
                return opts.fn(this);
            else
                return opts.inverse(this);
        })
        Handlebars.registerHelper("date", function(datetime) {
            return moment(datetime).calendar(null, {
                sameElse: 'DD/MM/YYYY'
            })
        })
    },
    dispatch: function() {
        switch(location.hash) {
            case '':
            case '#':
                API.getProjects(APP.projectsLoaded)
                return;
            case '#create-project':
                APP.processTemplate('root', 'new-project-template')
                return;
            case '#new-todo':
                APP.displayTodoForm()
                return;
        }
        if(location.hash.startsWith("#project_-_")) {
            var projectName = decodeURI(location.hash.split('_-_')[1])
            if(APP.projects.size === 0) {
                APP.init()
            }
            APP.currentProject = APP.projects.get(projectName)
            APP.loadCurrentProjectTodos()
        } else { // 404
            location.hash = '';
        }
    },
    projectsLoaded: function(projects) {
        for(var i = 0; i < projects._embedded.projects.length; i++) {
            APP.projectLoadStatus[i] = false;
            APP.projects.set(projects._embedded.projects[i].title, projects._embedded.projects[i]);
        }
        APP.processTemplate('root', 'default-template', projects._embedded.projects)
    },
    loadCurrentProjectTodos: function() {
        API.getProjectTodos(APP.currentProject, function(body) {
            APP.processTemplate('root', 'project-template', {
                projectName: APP.currentProject.title,
                todos: body._embedded.todos.sort(APP.sortTodos)
            })
        })
    },
    displayTodoForm: function() {
      APP.processTemplate('root', 'new-todo-template', {
          projectName: APP.currentProject.title
      });
      $("#new-todo-date").pikaday({
          format: 'YYYY-MM-DDT22:00:00.000'
      })
    },
    newProject: function() {
        API.addProject({
            title: $("#new-project-name").val()
        }, function() {
            $("#new-project-feedback").text("New project created!")
        })
    },
    newTodo: function() {
        var todo = $("#new-todo-form").serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
        API.addTodo(todo, function(newTodo) {
            API.addTodoToProject(APP.currentProject, newTodo, function() {
                location.hash = '#project_-_' + encodeURI(APP.currentProject.title)
            })
        })
    },
    changeTodoStatus: function(link, status) {
        API.changeTodoStatus(link, status, APP.loadCurrentProjectTodos)
    }
}