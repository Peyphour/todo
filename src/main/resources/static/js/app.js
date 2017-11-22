var APP = {
    projectLoadStatus: [],
    processTemplate: function (container, template_name, data) {
        $('#' + container).html(Handlebars.compile($('#' + template_name).html())(data))
    },
    init: function() {
        window.onhashchange = APP.dispatch
        APP.dispatch()
    },
    dispatch: function() {
        switch(location.hash) {
            case '':
            case '#':
                APP.processTemplate('root', 'default-template')
                break;
            case '#projects':
                API.getProjects(APP.projectsLoaded)
                break;
        }
    },
    projectsLoaded: function(projects) {
        for(var i = 0; i < projects._embedded.projects.length; i++) {
            APP.projectLoadStatus[i] = false;
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
        APP.processTemplate('root', 'project-template', projects._embedded.projects)
    }
}