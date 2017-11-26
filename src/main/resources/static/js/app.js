var APP = {
    projectLoadStatus: [],
    projects: new Map(),
    currentProject: {},
    processTemplate: function (container, template_name, data) {
        $('#' + container).html(Handlebars.compile($('#' + template_name).html())(data))
    },
    init: function() {
        window.onhashchange = APP.dispatch
        APP.dispatch()
        Handlebars.registerHelper("equals", function(a, b, opts) {
            if(a === b) // Or === depending on your needs
                return opts.fn(this);
            else
                return opts.inverse(this);
        })
        Handlebars.registerHelper("date", function(datetime) {
            return moment(datetime).calendar()
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
        }
        if(location.hash.startsWith("#project_-_")) {
            var projectName = decodeURI(location.hash.split('_-_')[1])
            console.log(projectName)
            APP.currentProject = APP.projects.get(projectName)
            API.getProjectTodos(APP.currentProject, function(body) {
                APP.processTemplate('root', 'project-template', {
                    projectName: projectName,
                    todos: body._embedded.todos
                })
            })
        } else { // 404
            location.hash = '';
        }
    },
    projectsLoaded: function(projects) {
        for(var i = 0; i < projects._embedded.projects.length; i++) {
            APP.projectLoadStatus[i] = false;
            APP.projects.set(projects._embedded.projects[i].title, projects._embedded.projects[i]);
            (function (i) {
                return API.getProjectTodos(projects._embedded.projects[i], function(todos) {
                    projects._embedded.projects[i].todos = todos._embedded.todos
                    APP.projectLoadStatus[i] = true
                    APP.tryRender(projects)
                })
            })(i)
        }

    },
    tryRender: function(projects) {
        for(var i = 0; i < APP.projectLoadStatus; i++) {
            if(APP.projectLoadStatus[i] === false)
                return
        }
        APP.processTemplate('root', 'default-template', projects._embedded.projects)
    },
    newProject: function() {
        API.addProject({
            title: $("#new-project-name").val()
        }, function() {
            $("#new-project-feedback").text("New project created!")
        })
    }
}