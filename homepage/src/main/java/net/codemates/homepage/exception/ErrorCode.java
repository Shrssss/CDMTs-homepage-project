package net.codemates.homepage.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	//400 Bad Request
	PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST,"パスワードが正しくありません。"),
	ITEM_NOT_RENTABLE(HttpStatus.BAD_REQUEST,"この備品は貸し出しできません。"),
	ITEM_ALREADY_RENTED(HttpStatus.BAD_REQUEST,"この備品はすでに貸し出し中です。"),
	NO_ACTIVE_RENTAL(HttpStatus.BAD_REQUEST,"有効な貸し出し記録が見つかりません。"),
	INVALID_IMAGE_FILE(HttpStatus.BAD_REQUEST,"画像ファイルは(jpg/png/gif)を指定してください。"),
	
	//401 Unauthorized
	LOGIN_FAILED(HttpStatus.UNAUTHORIZED,"学籍番号/メールアドレスまたはパスワードが間違っています。"),
	UNAUTHENTICATED(HttpStatus.UNAUTHORIZED,"ログインが必要です。"),
	ACCOUNT_NOT_APPROVED(HttpStatus.UNAUTHORIZED,"アカウントが承認されていません。"),
	
	//403 Forbidden
	ACCESS_DENIED(HttpStatus.FORBIDDEN,"この操作を行う権限がありません。"),
	
	//404 Not Found
	NEWS_NOT_FOUND(HttpStatus.NOT_FOUND,"指定された記事が見つかりません。"),
	MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND,"指定されたメンバーが見つかりません。"),
	ITEM_NOT_FOUND(HttpStatus.NOT_FOUND,"指定された備品が見つかりません。"),
	TECHNOLOGY_NOT_FOUND(HttpStatus.NOT_FOUND,"指定された技術が見つかりません。"),
	
	//409 Conflict
	DUPLICATE_STUDENT_ID(HttpStatus.CONFLICT,"この学籍番号は既に登録されています。"),
	DUPLICATE_EMAIL(HttpStatus.CONFLICT,"このメールアドレスは既に登録されています。"),
	
	//413 Payload Too Large
	FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE,"ファイルサイズが大きすぎます。(上限:5MB)"),
	
	//500 Internal Server Error
	UNEXPECTED_DB_STATE(HttpStatus.INTERNAL_SERVER_ERROR, "データベースの更新に失敗しました。"),
	FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR,"ファイルの保存に失敗しました。");
	
	private final HttpStatus status;
	private final String message;
	
}
