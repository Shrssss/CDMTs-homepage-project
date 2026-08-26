package net.codemates.homepage.mapper;

import java.util.List;
import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.ItemRentalHistory;

@Mapper
public interface ItemRentalHistoryMapper {
	
	List<ItemRentalHistory> findByIds(@Param("ids")List<Long> ids,
										@Param("offset") int offset,
										@Param("limit") int limit);
	
	List<ItemRentalHistory> findByItemIds(@Param("itemIds")List<Long> itemIds,
											@Param("offset") int offset,
											@Param("limit") int limit);
	
	List<ItemRentalHistory> findByRenterIds(@Param("renterIds")List<Long> renterIds,
												@Param("offset") int offset,
												@Param("limit") int limit);
	
	ItemRentalHistory findActiveByItemIdAndRenterId(@Param("itemId") Long itemId,@Param("renterId") Long renterId);
	
	int insert(ItemRentalHistory history);		//transactional
	
	int updateReturningDayTime(Long id);	//transactional
		
	int deleteById(Long id);	//transactional
	
}
