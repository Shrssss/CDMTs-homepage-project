package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Item;

@Mapper
public interface ItemMapper {

	List<Item> findByIds(@Param("ids")List<Long> ids);
	
	List<Item> search(@Param("name")String name,
						@Param("storageLocations")List<String> storageLocations,
						@Param("isDisposable")Boolean isDisposable,
						@Param("isRentable")Boolean isRentable,
						@Param("offset") int offset,
			            @Param("limit") int limit);
	
	int insert(Item item); //transactional
	
	int update(Item item);	//transactional
	
	int updateIsRentable(@Param("id")Long id,@Param("isRentable")Boolean isRentable);
	
	int updateByRenting(@Param("id")Long id,@Param("renterId")Long renterId); //transactional
	
	int updateByReturning(@Param("id")Long id,@Param("renterId")Long renterId); //transactional
	
	int deleteById(Long id); //transactional
	
}
