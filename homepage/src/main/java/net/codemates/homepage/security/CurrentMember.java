package net.codemates.homepage.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import net.codemates.homepage.exception.BusinessException;
import net.codemates.homepage.exception.ErrorCode;
import net.codemates.homepage.model.entity.Member;

@Component
public class CurrentMember {

	public Member get() {
		
		Authentication auth=SecurityContextHolder.getContext().getAuthentication();
		
		return ((MemberUserDetails)auth.getPrincipal()).getMember();
		
	}
	
	public boolean isAdmin() {
		
		return "ADMIN".equals(get().getRole());
				
	}
	
	public void requireSelfOrAdmin(Long targetId) {
		
		if(!get().getId().equals(targetId)&&!isAdmin()) {
			
			throw new BusinessException(ErrorCode.ACCESS_DENIED);
			
		}
		
	}
	
	public static Long idOrNull() {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    if (auth == null||!(auth.getPrincipal() instanceof MemberUserDetails d)) return null;
	    return d.getMember().getId();
	}
	
}
