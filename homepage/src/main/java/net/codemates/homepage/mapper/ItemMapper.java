package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.Item;

@Mapper
public interface ItemMapper {

	Item findById(Long id);
	
	List<Item> findByName(String name);
	
	List<Item> findByStorage(String storageLocation);
	
	List<Item> findByDisposable(Boolean isDisposable);
	
	List<Item> findByRentable(Boolean isRentable);
	
	List<Item> findAll();
	
	void insert(Item item); //transactional
	
	void update(Item item);	//transactional
	
	void updateRenterIdById(Long id,Long renterId); //transactional
	
	void deleteById(Long id); //transactional
	
}
