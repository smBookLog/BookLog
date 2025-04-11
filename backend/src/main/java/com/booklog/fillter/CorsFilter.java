package com.booklog.fillter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class CorsFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 초기화 로직이 필요하다면 여기에 작성
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse res = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;

        // 요청 허용할 프론트엔드 origin
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

        // 인증 쿠키 허용 (axios에서 withCredentials: true 쓸 경우 필요)
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // 허용할 HTTP 메서드
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // 허용할 헤더
        res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");

        // OPTIONS 요청 처리 (preflight)
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(request, response);  // 다음 필터 또는 서블릿 호출
        }
    }

    @Override
    public void destroy() {
        // 종료 시 처리할 로직
    }
}