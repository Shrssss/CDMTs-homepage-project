import Header from "@/components/header";
import TypoGraphyWrapper from "@/components/TypoGraphyWrapper";

const page = () => {
	return(
        <>
		<Header/>
		<TypoGraphyWrapper>
            <h1>ログインしてください</h1>

            <form>
			    <input type ="text" name="username" placeholder="USER_ID"/>
			    <input type ="password" name="password" placeholder="PASSWORD"/>
			    <button type="submit">ログイン(Login)</button>

			<div>
                <label>
                    <input type="checkbox"/>
                     私はロボットではありません
                </label>
            </div>
            </form>
		</TypoGraphyWrapper>
		</>
	);
	};
	export default page;