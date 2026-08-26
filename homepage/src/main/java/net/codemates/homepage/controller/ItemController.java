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
import net.codemates.homepage.model.dto.item.ItemCreateRequest;
import net.codemates.homepage.model.dto.item.ItemDetailResponse;
import net.codemates.homepage.model.dto.item.ItemRentalHistoryResponse;
import net.codemates.homepage.model.dto.item.ItemResponse;
import net.codemates.homepage.model.dto.item.ItemUpdateRequest;
import net.codemates.homepage.service.ItemService;


@RestController
@RequiredArgsConstructor
@CrossOrigin(origins=" !! placeHolder !! ")
@RequestMapping("/api/items")
public class ItemController {
	
	private final ItemService itemService;
	
    /*
     * 備品作成
     * 
     * メソッド名 	: createItem
     * 戻り値		: Long itermId
     * 引数		: ItemCreateRequest
     * 
     * 		POST /api/items
     * 
     */
	@PostMapping
	public Long createItem(@Valid @RequestBody ItemCreateRequest itemDto) {
		
		return itemService.createItem(itemDto);
	
	}
	
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
	@PutMapping("/{id}")
	public void updateItem(@PathVariable Long id, @Valid @RequestBody ItemUpdateRequest itemDto) {
		
		itemDto.setId(id);
		
		itemService.updateItem(itemDto);
		
	}
	
    /*
     * 備品詳細取得
     * 
     * メソッド名 	: getItemDetail
     * 戻り値		: ItemDetailResponse
     * 引数		: Long id
     * 
     * 		GET /api/items/{id}
     * 
     */
	@GetMapping("/{id}")
	public ItemDetailResponse getItemDetail(@PathVariable Long id) {
		
		return itemService.getItemDetail(id);
		
	}
	
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
	@GetMapping
	public List<ItemResponse> searchItems(@RequestParam(required=false) String name,
											@RequestParam(required=false) List<String> strageLocation,
											@RequestParam(required=false) Boolean isDisposable,
											@RequestParam(required=false) Boolean isRentable,
											@RequestParam(defaultValue="1") Integer page){
		
		return itemService.searchItems(
							name,
							strageLocation, 
							isDisposable, 
							isRentable, 
							page);
		
	}
	
    /*
     * 備品の貸し出し履歴表示
     * 
     * メソッド名 	: getItemRentalHistories
     * 戻り値		: List<ItemRentalHistoryResponse>
     * 引数		: Long id,Integer page
     * 
     * 		GET /api/items/{id}/history
     * 
     */
	@GetMapping("/{id}/history")
	public List<ItemRentalHistoryResponse> getItemRentalHistories(@PathVariable Long id,@RequestParam(defaultValue="1")Integer page){
		
		return itemService.getItemRentalHistories(id,page);
	
	}
	
    /*
     * 備品の貸し出し
     * 
     * メソッド名 	: rentItems
     * 戻り値		: Long itemId
     * 引数		: Long id,Long renterId
     * 
     * 		PUT /api/items/rent/{id}/{renterId}
     * 
     */
	@PutMapping("/rent/{id}/{renterId}")
	public Long rentItem(@PathVariable Long id,@PathVariable Long renterId){
		
		return itemService.rentItem(id,renterId);
		
	}
	
    /*
     * 備品の返却
     * 
     * メソッド名 	: returnItems
     * 戻り値		: Long itemId
     * 引数		: Long id,Long renterId
     * 
     * 		PUT /api/items/return
     * 
     */
	@PutMapping("/return/{id}/{renterId}")
	public Long returnItem(@PathVariable Long id,@PathVariable Long renterId){
		
		return itemService.returnItem(id,renterId);
		
	}
	
    /*
     * 備品の在庫更新
     * 
     * メソッド名 	: toggleIsRentable
     * 戻り値		: Long itemId
     * 引数		: Long id,Boolean isRentable
     * 
     * 		PUT /api/items/Availability
     * 
     */
	@PutMapping("/Availability/{id}/{isRentable}")
	public Long toggleIsRentable(@PathVariable Long id,@PathVariable Boolean isRentable){
		
		return itemService.toggleIsRentable(id,isRentable);
		
	}
	
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
//	@DeleteMapping("/{id}")
//	public void deleteItem(Long id) {
//		
//		itemService.deleteItem(id);
//		
//	}
	
}
