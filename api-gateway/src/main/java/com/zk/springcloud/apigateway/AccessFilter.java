package com.zk.springcloud.apigateway;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

import javax.servlet.http.HttpServletRequest;

/**
 * 测试zuul的核心功能之一：请求过滤功能
 */
public class AccessFilter extends ZuulFilter {
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(AccessFilter.class);

	//前置
	@Override
	public String filterType() {
		return "pre";
	}

	//优先级
	@Override
	public int filterOrder() {
		return 0;
	}

	//是否执行
	@Override
	public boolean shouldFilter() {
		return true;
	}

	//过滤的逻辑
	@Override
	public Object run() throws ZuulException {
		RequestContext ctx=RequestContext.getCurrentContext();
		HttpServletRequest request=ctx.getRequest();
		logger.info("send { } request to { }",request.getMethod() ,request.getRequestURI().toString());
		Object accessToken=request.getParameter("accessToken");
		if(accessToken==null){
			logger.info("access token is empty");
			ctx.setSendZuulResponse(false);
			ctx.setResponseStatusCode(401);
			return null;
		}
		logger.info("access token ok");
		return null;
	}
}

