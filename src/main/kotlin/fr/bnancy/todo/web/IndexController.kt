package fr.bnancy.todo.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/")
class IndexController {

    @RequestMapping
    fun index(): String {
        return "index"
    }
}