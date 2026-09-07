package net.codemates.homepage.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.ItemMapper;
import net.codemates.homepage.mapper.ItemRentalHistoryMapper;
import net.codemates.homepage.mapper.MemberMapper;
import net.codemates.homepage.model.dto.item.ItemCreateRequest;
import net.codemates.homepage.model.dto.item.ItemDetailResponse;
import net.codemates.homepage.model.dto.item.ItemRentalHistoryResponse;
import net.codemates.homepage.model.dto.item.ItemResponse;
import net.codemates.homepage.model.dto.item.ItemUpdateRequest;
import net.codemates.homepage.model.entity.Item;
import net.codemates.homepage.model.entity.ItemRentalHistory;
import net.codemates.homepage.model.entity.Member;

@Service
@RequiredArgsConstructor
public class ItemService {

	private final ItemMapper itemMapper;
	
	private final ItemRentalHistoryMapper itemRentalHistoryMapper;
	
	private final MemberMapper memberMapper;
	
	private static final int PAGE_SIZE=20;
	
	private ItemResponse toItemResponse(Item item) {
		
		return new ItemResponse(
					item.getId(),
					item.getName(),
					item.getStorageLocation(),
					item.getIsDisposable(),
					item.getIsRentable()
				);
		
	}
	
	private ItemDetailResponse toItemDetailResponse(Item item) {
		
		return new ItemDetailResponse(
					item.getId(),
					item.getName(),
					item.getDescription(),
					item.getStorageLocation(),
					item.getQuantity(),
					item.getIsDisposable(),
					item.getIsRentable()
				);
		
	}
	
	private ItemRentalHistoryResponse toHistoryResponse(ItemRentalHistory history,String renterName,String itemName) {
		
		return new ItemRentalHistoryResponse(
					history.getId(),
					itemName,
					renterName,
					history.getRentedAt(),
					history.getReturnedAt()
				);
		
	}
	
	@Transactional
	public Long createItem(ItemCreateRequest itemDto) {
		
		Item itemEntity=itemDto.toEntity();
		
		int insertCount=itemMapper.insert(itemEntity);
		
		if(insertCount!=1) throw new IllegalStateException("Expected 1 insert row but was "+insertCount+".");
		
		return itemEntity.getId();
		
	}
	
	@Transactional
	public void updateItem(ItemUpdateRequest itemDto) {
		
		int updateCount=itemMapper.update(itemDto.toEntity());
		
		if(updateCount!=1) throw new IllegalStateException("Expected 1 update row but was "+updateCount+".");
		
	}
	
	public ItemDetailResponse getItemDetail(Long id) {
		
		return toItemDetailResponse(itemMapper.findByIds(List.of(id)).getFirst());
		
	}
	
	public List<ItemResponse> searchItems(String name,
											List<String> strageLocation,
											Boolean isDisposable,
											Boolean isRentable,
											Integer page){
		
		int currentPage=(page==null||page<0)?1:page;
		int offset=(currentPage-1)*PAGE_SIZE;
		
		List<Item>itemEntities=itemMapper.search(
											name,
											strageLocation,
											isDisposable,
											isRentable,
											offset,
											PAGE_SIZE);
		
		return itemEntities.stream().map(this::toItemResponse).toList();
		
	}
	
	public List<ItemRentalHistoryResponse> getItemRentalHistories(Long id,Integer page){
		
		int currentPage=(page==null||page<0)?1:page;
		int offset=(currentPage-1)*PAGE_SIZE;
		
		List<ItemRentalHistory> itemRentalHistoryEntities=itemRentalHistoryMapper.findByItemIds(List.of(id),offset,PAGE_SIZE);
		
		Map<Long,Member> renterEntities=memberMapper.findByIds(
													itemRentalHistoryEntities.stream()
																.map(ItemRentalHistory::getRenterId)
																.distinct()
																.toList()
													).stream()
													.collect(Collectors.toMap(
																Member::getId,
																Function.identity()
															)
													);
		
		Item itemEntity=itemMapper.findByIds(List.of(id)).getFirst();
		
		return itemRentalHistoryEntities.stream().map(history->toHistoryResponse(
																history,
																renterEntities.get(history.getRenterId()).getName(),
																itemEntity.getName()
															)
													).toList();
		
	}
	
	@Transactional
	public Long rentItem(Long id,Long renterId){
		
		int itemUpdateCount=itemMapper.updateByRenting(id,renterId);
		
		if(itemUpdateCount!=1) throw new IllegalStateException("Expected 1 update row in item, but was "+itemUpdateCount+".");
		
		ItemRentalHistory history=new ItemRentalHistory(
										null,
										id,
										renterId,
										null,
										null
									);
		
		int historyInsertCount=itemRentalHistoryMapper.insert(history);
		
		if(historyInsertCount!=1) throw new IllegalStateException("Expected 1 insert row in history, but was "+historyInsertCount+".");
		
		return id;
		
	}
	
	@Transactional
	public Long returnItem(Long id,Long renterId) {
		
		int itemUpdateCount=itemMapper.updateByReturning(id,renterId); 
		
		if(itemUpdateCount!=1) throw new IllegalStateException("Expected 1 update row in item, but was "+itemUpdateCount+".");
		
		ItemRentalHistory activeHistory=itemRentalHistoryMapper.findActiveByItemIdAndRenterId(id, renterId);
		
		if (activeHistory == null)throw new IllegalStateException("Active rental history not found. itemId="+id+", renterId="+renterId);
		
		int historyUpdateCount=itemRentalHistoryMapper.updateReturningDayTime(activeHistory.getId());
		
		if(historyUpdateCount!=1) throw new IllegalStateException("Expected 1 update row in item, but was "+historyUpdateCount+".");
		
		return id;
		
	}
	
	@Transactional
	public Long toggleIsRentable(Long id,Boolean isRentable) {
		
		int updateCount=itemMapper.updateIsRentable(id,isRentable);
		
		if(updateCount!=1) throw new IllegalStateException("Expected 1 update row but was "+updateCount+".");
		
		return id;
		
	}
	
	@Transactional
	public void deleteItem(Long id) {
		
		int deleteCount=itemMapper.deleteById(id);
		
		if(deleteCount!=1) throw new IllegalStateException("Expected 1 delete but was "+deleteCount+".");
		
	}
	
}
