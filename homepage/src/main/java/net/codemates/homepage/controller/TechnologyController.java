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
import net.codemates.homepage.model.dto.member.MemberResponse;
import net.codemates.homepage.model.dto.technology.TechnologyCreateRequest;
import net.codemates.homepage.model.dto.technology.TechnologyDetailResponse;
import net.codemates.homepage.model.dto.technology.TechnologyResponse;
import net.codemates.homepage.model.dto.technology.TechnologyUpdateRequest;
import net.codemates.homepage.service.TechnologyService;

@RestController
@RequestMapping("/api/technologies")
@CrossOrigin(origins=" !! placeHolder !! ")
@RequiredArgsConstructor
public class TechnologyController {
	
	private final TechnologyService technologyService;
	
    /*
     * 技術登録
     * 
     * メソッド名 	: createTechnology
     * 戻り値		: Long
     * 引数		: TechnologyCreateRequest
     * 
     * 		POST /api/technologies
     * 
     */
	
	@PostMapping
	public Long createTechnology(@Valid @RequestBody TechnologyCreateRequest technologyDto) {
		
		return technologyService.createTechnology(technologyDto);
		
	}
	
    /*
     * 技術編集
     * 
     * メソッド名 	: updateTechnology
     * 戻り値		: void
     * 引数		: TechnologyUpdateRequest
     * 
     * 		PUT /api/technologies/{id}
     * 
     */
	
	@PutMapping("/{id}")
	public void updateTechnology(@PathVariable Long id,@Valid @RequestBody TechnologyUpdateRequest technologyDto) {
		
		technologyService.updateTechnology(id,technologyDto);
		
	}
	
    /*
     * 技術表示
     * 
     * メソッド名 	: getTechnologies
     * 戻り値		: List<TechnologyResponse>
     * 引数		: String name,Integer page
     * 
     * 		GET /api/technologies
     * 
     */
	
	@GetMapping
	public List<TechnologyResponse> searchTechnologies(@RequestParam(required=false) String name,
														@RequestParam(required=false) Integer page) {
		
		return technologyService.searchTechnologies(name,page);
		
	}
	
    /*
     * 技術詳細表示
     * 
     * メソッド名 	: getTechnologyDetail
     * 戻り値		: TechnologyDeatilResponse
     * 引数		: Long id
     * 
     * 		GET /api/technologies/{id}
     * 
     */
	
	@GetMapping("/{id}")
	public TechnologyDetailResponse getTechnologyDetail(@PathVariable Long id) {
		
		return technologyService.getTechnologyDetail(id);
	
	}
	
    /*
     * 習得者表示
     * 
     * メソッド名 	: getSkilledMember
     * 戻り値		: List<MemberResponse>
     * 引数		: Long id
     * 
     * 		GET /api/technologies/{id}/members
     * 
     */
	
	@GetMapping("/{id}/members")
	public List<MemberResponse> getSkilledMember(@PathVariable Long id) {
		return technologyService.getSkilledMember(id);
	}
	
    /*
     * 技術消去
     * 
     * メソッド名 	: deleteTechnology
     * 戻り値		: void
     * 引数		: Long id
     * 
     * 		DELETE /api/technologies/{id}
     * 
     */
	
	@DeleteMapping("/{id}")
	public void deleteTechnology(@PathVariable Long id) {
		technologyService.deleteTechnology(id);
	}
	
	
}
