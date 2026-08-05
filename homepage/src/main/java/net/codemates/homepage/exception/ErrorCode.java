package net.codemates.homepage.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	//404
	NEWS_NOT_FOUND(HttpStatus.NOT_FOUND,"指定された記事が見つかりません。"),
	
	//500
	UNEXPECTED_DB_STATE(HttpStatus.INTERNAL_SERVER_ERROR, "データベースの更新に失敗しました。");
	
	private final HttpStatus status;
	private final String message;
	
}
