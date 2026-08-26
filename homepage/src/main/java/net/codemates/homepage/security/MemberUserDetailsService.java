package net.codemates.homepage.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.MemberMapper;
import net.codemates.homepage.model.entity.Member;

@Service
@RequiredArgsConstructor
public class MemberUserDetailsService implements UserDetailsService{
	
	private final MemberMapper mapper;
	
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
		
		Member member=mapper.findByStudentIdOrEmail(username);
		
		if(member==null) throw new UsernameNotFoundException("Member not found");
		
		return new MemberUserDetails(member);
	}
	
}
