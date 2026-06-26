package net.codemates.homepage.mapper;

import java.util.List;
import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.ItemRentalHistory;

@Mapper
public interface ItemRentalHistoryMapper {
	
	List<ItemRentalHistory> findByIds(@Param("ids")List<Long> ids);
	
	List<ItemRentalHistory> findByItemIds(@Param("itemIds")List<Long> itemIds);
	
	List<ItemRentalHistory> findByRenterIds(@Param("renterIds")List<Long> renterIds);
	
	List<ItemRentalHistory> findAll();
	
	void insert(ItemRentalHistory history);		//transactional
	
	void updateReturningDayTime(LocalDateTime returnedAt);	//transactional
		
	void deleteById(Long id);	//transactional
	
}
