package net.codemates.homepage.mapper;

import java.util.List;
import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.ItemRentalHistory;

@Mapper
public interface ItemRentalHistoryMapper {
	
	List<ItemRentalHistory> findById(Long id);
	
	List<ItemRentalHistory> findByItemId(Long itemId);
	
	List<ItemRentalHistory> findByRenterId(Long renterId);
	
	List<ItemRentalHistory> findAll();
	
	void insert(ItemRentalHistory history);		//transactional
	
	void updateReturningDayTime(LocalDateTime returnedAt);	//transactional
		
	void deleteById(Long id);	//transactional
	
}
