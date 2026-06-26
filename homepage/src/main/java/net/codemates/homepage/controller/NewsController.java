package net.codemates.homepage.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@CrossOrigin(origins="")
@RequiredArgsConstructor
public class NewsController {

	private final NewsService service;
	
	@GetMapping("/{id}")
	public NewsDetailResponse getNewsDetail(@PathVariable Long id) {
		
		return service.findNewsDetailById(id);
		
	}
	
	@GetMapping
	public List<NewsResponse> searchNews(@RequestParam(required=false)String keyword,
											@RequestParam(required=false)List<String> categories,
											@RequestParam(defaultValue="1")Integer page){
		
		return service.searchNews(keyword,categories,page);
		
	}
	
	@PostMapping
	public Long createNews(@Valid @RequestBody NewsCreateRequest newsDto) {
		
		return service.createNews(newsDto);
		
	}
	
	@PutMapping("/{id}")
	public void updateNews(@Valid @RequestBody NewsUpdateRequest newsDto) {
		
		service.updateNews(newsDto);
		
	}
	
	@PutMapping("/{id}/published")
	public void updateIspublishedById(@PathVariable Long id,@RequestParam Boolean isPublished) {
		
		service.updateIsPublishedById(id,isPublished);
		
	}
	
	@DeleteMapping("/{id}")
	public void deleteNewsById(@PathVariable Long id) {
		
		service.deleteNewsById(id);
		
	}
	
}
