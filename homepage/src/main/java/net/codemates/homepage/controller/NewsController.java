package net.codemates.homepage.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.codemates.homepage.model.dto.news.NewsCreateRequest;
import net.codemates.homepage.model.dto.news.NewsDetailResponse;
import net.codemates.homepage.model.dto.news.NewsResponse;
import net.codemates.homepage.model.dto.news.NewsUpdateRequest;
import net.codemates.homepage.service.NewsService;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins=" !! placeHolder !! ")
@RequiredArgsConstructor
public class NewsController {
	
	/*
	 * Controller層(News)
	 *
	 * クライアントから送られてきたHTTPリクエストを受け付ける。
	 *
	 * 画面 -> Service
	 *      リクエストパラメータやJSONを受け取り、
	 *      Service層へ処理を依頼する。
	 *
	 * Service -> 画面
	 *      Serviceから受け取ったResponseDTOを
	 *      HTTPレスポンス(JSON)としてクライアントへ返す。
	 *
	 *  Controllerでは業務処理(DB操作や検索処理など)は行わず、Serviceへ処理を委譲する。
	 *   
	 */
	
	//Serviceの注入(DI:Dependency Injection)
	private final NewsService newsService;
	
    /*
     * ニュース詳細取得	(記事を読むときに使用)
     *
     * 		GET /api/news/{id}
     *
     * 			URLに含まれるIDの記事を1件取得する。
     * 
     */
	@GetMapping("/{id}")
	public NewsDetailResponse getNewsDetail(@PathVariable Long id) {
		
		return newsService.findNewsDetailById(id);
		
	}
	
    /*
     * ニュース検索・一覧取得
     *
     * 		GET /api/news
     *
     * 			keyword     : キーワード検索（任意）
     * 			categories  : カテゴリ検索（任意・複数指定可）
     * 			page        : ページ番号（指定がなければ1ページ目）
     * 
     */
	@GetMapping
	public List<NewsResponse> searchNews(@RequestParam(required=false)String keyword,
											@RequestParam(required=false)List<String> categories,
											@RequestParam(defaultValue="1")Integer page){
		
		return newsService.searchNews(keyword,categories,page);
		
	}
	
    /*
     * ニュース作成
     *
     * 		POST /api/news
     *
     * 			JSONをNewsCreateRequestへ変換する。
     * 
     */
	@PostMapping
	public Long createNews(@Valid @RequestBody NewsCreateRequest newsDto) {
		
		return newsService.createNews(newsDto);
		
	}
	
    /*
     * ニュース更新
     *
     * 		PUT /api/news/{id}
     *
     *		 指定されたIDの記事を更新する。
     * 		 更新内容はJSONで受け取る。
     * 
     */
	@PutMapping("/{id}")
	public void updateNews(@PathVariable Long id,@Valid @RequestBody NewsUpdateRequest newsDto) {
		
		newsDto.setId(id);
		
		newsService.updateNews(newsDto);
		
	}
	
    /*
     * 公開・非公開の切り替え
     *
     * 		PATCH /api/news/{id}/published
     *
     * 			公開状態(isPublished)のみ更新する。
     * 
     */
	@PatchMapping("/{id}/published")
	public void updateIspublishedById(@PathVariable Long id,@RequestParam Boolean isPublished) {
		
		newsService.updateIsPublishedById(id,isPublished);
		
	}
	
//    /*
//     * ニュース削除
//     *
//     * 		DELETE /api/news/{id}
//     *
//     * 			指定されたIDの記事を削除する。
//     * 
//     */
//	@DeleteMapping("/{id}")
//	public void deleteNewsById(@PathVariable Long id) {
//		
//		newsService.deleteNewsById(id);
//		
//	}
	
}
