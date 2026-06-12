package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.ItemRentalHistory;

@Mapper
public interface ItemRentalHistoryMapper {
	
	ItemRentalHistory findByHistoryId(Long historyId);
	
	ItemRentalHistory findByItemId(Long itemId);
	
	ItemRentalHistory findByRenterId(Long renterId);
	
	List<ItemRentalHistory> findAll();
	
	void insert(ItemRentalHistory history);
	
	void update(ItemRentalHistory history);
	
	void deleteById(Long id);
	
}
