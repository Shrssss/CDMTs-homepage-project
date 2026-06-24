package net.codemates.homepage.model.dto.item;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ItemRentalHistoryResponse {

	/* 貸し出し履歴を表示するObjectを定義するクラス　*/
	
	@NotNull
	private Long id;
	
	@NotBlank
	@Size(max=100)
	private String itemName;
	
	@NotBlank
	@Size(max=50)
	private String memberName;
	
	@NotNull
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private LocalDateTime rentedAt;
	
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private LocalDateTime returnedAt;
	
}
