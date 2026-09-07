package net.codemates.homepage.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ErrorResponse> handleException(BusinessException e){
		
		ErrorCode errorCode=e.getErrorCode();
		
		return ResponseEntity.status(errorCode.getStatus())
					.body(new ErrorResponse(errorCode.getMessage()));
		
	}
	
}
