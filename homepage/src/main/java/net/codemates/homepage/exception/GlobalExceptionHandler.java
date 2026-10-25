package net.codemates.homepage.exception;

import java.util.stream.Collectors;

import org.springframework.beans.TypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
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
	public ResponseEntity<ErrorResponse> handleUnexpected(Exception e)throws Exception{
		
		if(e instanceof AccessDeniedException||e instanceof AuthenticationException) throw e;

		if(e instanceof org.springframework.web.ErrorResponse springError){
			
			HttpStatusCode status=springError.getStatusCode();
			
			log.warn("リクエストエラー: {} {}",status.value(),e.getMessage());
			
			return ResponseEntity.status(status).body(new ErrorResponse(messageFor(status)));
			
		}
		
		log.error("想定外のエラー",e);
		
		return ResponseEntity.status(500).body(new ErrorResponse("サーバー内部でエラーが発生しました。"));
		
	}
	
	@ExceptionHandler(DataIntegrityViolationException.class)
	
	public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException e){
		
		log.warn("DB制約違反: {}",e.getMostSpecificCause().getMessage());
		
		return ResponseEntity.status(409)
				.body(new ErrorResponse("既に登録されている値、または存在しないデータが指定されています。"));
		
	}
	
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ErrorResponse> handleTooLearge(MaxUploadSizeExceededException e){
		
		ErrorCode errorCode=ErrorCode.FILE_TOO_LARGE;
		
		log.warn("アップロードサイズ超過: {}",e.getMessage());
		
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
	
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleNotReadable(HttpMessageNotReadableException e){
		
		log.warn("リクエスト本文を読み取れません: {}",e.getMessage());
		
		return ResponseEntity.badRequest().body(new ErrorResponse("リクエストの形式が正しくありません。"));
		
	}

	@ExceptionHandler(TypeMismatchException.class)
	public ResponseEntity<ErrorResponse> handleTypeMismatch(TypeMismatchException e){
		
		log.warn("パラメータの型が正しくありません: {}",e.getMessage());
		
		return ResponseEntity.badRequest().body(new ErrorResponse("パラメータの形式が正しくありません。"));
		
	}

	private String messageFor(HttpStatusCode status){
		
		return switch(status.value()){
			case 404 -> "指定されたリソースが見つかりません。";
			case 405 -> "このメソッドは許可されていません。";
			case 415 -> "サポートされていない形式です。";
			default -> "リクエストが正しくありません。";
		};
		
	}
	
}
