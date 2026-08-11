package net.codemates.homepage.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.model.entity.Member;

@RequiredArgsConstructor
public class MemberUserDetails implements UserDetails{	
	
	private final Member member;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities(){
		return List.of();	//role追加？
	}

	@Override
	public String getPassword() {
		return member.getPasswordHash();
	}

	@Override
	public String getUsername() {
		return member.getStudentId();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
