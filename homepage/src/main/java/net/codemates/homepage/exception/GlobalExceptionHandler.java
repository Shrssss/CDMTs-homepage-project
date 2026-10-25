package net.codemates.homepage.exception;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ErrorResponse> handleException(BusinessException e){
		
		ErrorCode errorCode=e.getErrorCode();
		
		if(errorCode.getStatus().is5xxServerError()) log.error("業務例外(5xx): {}",errorCode,e);
		else log.warn("業務例外: {} - {}",errorCode,errorCode.getMessage());
		
		return ResponseEntity.status(errorCode.getStatus())
					.body(new ErrorResponse(errorCode.getMessage()));
		
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleUnexpected(Exception e){
		
		log.error("想定外のエラー",e);
		
		return ResponseEntity.status(500).body(new ErrorResponse("サーバー内部でエラーが発生しました。"));
		
	}
	
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ErrorResponse> handleTooLearge(){
		
		ErrorCode errorCode=ErrorCode.FILE_TOO_LARGE;
		
		return ResponseEntity.status(errorCode.getStatus())
				.body(new ErrorResponse(errorCode.getMessage()));
		
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException  e){
		
		String message=e.getBindingResult().getFieldErrors().stream()
							.map(f->f.getField()+": "+f.getDefaultMessage())
							.collect(Collectors.joining(" / "));
		
		return ResponseEntity.badRequest().body(new ErrorResponse(message));
		
	}
	
}
