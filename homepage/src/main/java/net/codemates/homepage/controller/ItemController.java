package net.codemates.homepage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/items")
public class ItemController {
	
    /*
     * 備品作成
     * 
     * メソッド名 	: createItem
     * 戻り値		: Long
     * 引数		: ItemCreateRequest
     * 
     * 		POST /api/items
     * 
     */
	
    /*
     * 備品更新
     * 
     * メソッド名 	: updateItem
     * 戻り値		: void
     * 引数		: ItemUpdateRequest
     * 
     * 		PUT /api/items/{id}
     * 
     */
	
    /*
     * 備品詳細取得
     * 
     * メソッド名 	: getItemDetail
     * 戻り値		: itemDetailResponse
     * 引数		: Long id
     * 
     * 		GET /api/items/{id}
     * 
     */
	
    /*
     * 備品全体取得・検索
     * 
     * メソッド名 	: searchItems
     * 戻り値		: List<ItemResponse>
     * 引数		: String name,List<String> strageLocation,Boolean isDisposable,Boolean isRentable,Integer page
     * 
     * 		GET /api/items
     * 
     */
	
    /*
     * 備品の貸し出し履歴表示
     * 
     * メソッド名 	: getItemRentalHistories
     * 戻り値		: List<ItemRentalHistoryResponse>
     * 引数		: Long id,Integer page
     * 
     * 		PATCH /api/items/{id}/history
     * 
     */
	
    /*
     * 備品の貸し出し
     * 
     * メソッド名 	: rentItems
     * 戻り値		: List<Long>
     * 引数		: List<Long> ids,Long renterId
     * 
     * 		PUT /api/items/rent
     * 
     */
	
//	※作成後コメントアウト(使わないが一応書く)
//    /*
//     * 備品削除
//     *
//     * メソッド名 	: deleteItem
//     * 戻り値		: void
//     * 引数		: Long id
//     * 		DELETE /api/items/{id}
//     * 
//     */
}
