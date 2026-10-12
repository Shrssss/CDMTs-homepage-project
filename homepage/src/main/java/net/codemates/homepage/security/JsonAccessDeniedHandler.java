package net.codemates.homepage.security;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.codemates.homepage.exception.ErrorCode;
import net.codemates.homepage.exception.ErrorResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class JsonAccessDeniedHandler implements AccessDeniedHandler{
	
	private final ObjectMapper objectMapper;
	
	@Override
	public void handle(HttpServletRequest request,HttpServletResponse response,AccessDeniedException e)throws IOException {
		
		ErrorCode errorCode=(e instanceof CsrfException)
							?ErrorCode.CSRF_TOKEN_INVALID
							:ErrorCode.ACCESS_DENIED;
		
		response.setStatus(errorCode.getStatus().value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		objectMapper.writeValue(response.getWriter(),new ErrorResponse(errorCode.getMessage()));
		
	}

}
