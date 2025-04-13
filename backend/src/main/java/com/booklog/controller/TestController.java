package com.booklog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class TestController {

    @CrossOrigin(origins = "http://localhost:3001") // React 포트 허용
    @ResponseBody
    @RequestMapping(value = "/api/hello", method = RequestMethod.GET, produces = "text/plain; charset=UTF-8")
    public String hello(@RequestParam("ck") String ck) {
    	System.out.println(ck);
        return "React - Spring 연결 성공";
    }
}
