var APP = {
    projectLoadStatus: [],
    init: function() {
        API.getProjects(this.projectsLoaded)
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
        $("#root").html(Handlebars.compile($("#project-template").html())(projects._embedded.projects))
    }
}