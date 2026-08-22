import Header from "@/components/Header";
import TypoGraphyWrapper from "@/components/TypoGraphyWrapper";

const Page = () => {
	return(
        <>
		<Header/>
		<TypoGraphyWrapper>
			<form>
       		 <label htmlFor="identifier">学籍番号 または メールアドレス</label>
			 <input
				id="identifier"
				type="text"
		  		name="identifier"
		   		placeholder="例：01A2345 または example123@example.com"
		   		required
		/>

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
	export default Page;