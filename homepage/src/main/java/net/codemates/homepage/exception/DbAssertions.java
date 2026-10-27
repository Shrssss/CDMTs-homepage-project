package net.codemates.homepage.exception;

public final class DbAssertions {

	private DbAssertions() {}
	
	public static void requireAffected(int expected,int actual) {
		
		if(actual!=expected) throw new BusinessException(ErrorCode.UNEXPECTED_DB_STATE);
		
	}
	
}
