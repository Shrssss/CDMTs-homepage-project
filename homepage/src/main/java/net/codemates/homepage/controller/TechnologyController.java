package net.codemates.homepage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/technologies")
public class TechnologyController {
	
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
	
}
