import Provider from '@/app/QueryClientProvider';
import Client from "./MemberClient"
import LoginRequiredHeader from '../LoginRequiredHeader';

// サークルメンバー一覧
const Page = () => {
  return (
    <div className="">
      <Provider>
        <LoginRequiredHeader />
        <Client/>
      </Provider>
    </div>
  )
}

export default Page