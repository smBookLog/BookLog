package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class TestController {

    @CrossOrigin(origins = "http://localhost:3000") // React 포트 허용
    @ResponseBody
    @RequestMapping(value = "/api/hello", method = RequestMethod.GET)
    public String hello(@RequestParam("ck") String ck) {
    	System.out.println(ck);
        return "React - Spring Success";
    }
}
