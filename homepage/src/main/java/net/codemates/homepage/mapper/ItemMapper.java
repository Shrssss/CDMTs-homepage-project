package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.Item;

@Mapper
public interface ItemMapper {

	Item findById(Long id);
	
	Item findByName(String name);
	
	Item findByStorage(String storageLocation);
	
	Item findByDisposable(Boolean isDisposable);
	
	Item findByRentable(Boolean isRentable);
	
	List<Item> findAll();
	
	void insert(Item item);
	
	void update(Item item);
	
	void deleteById(Long id);
	
}
