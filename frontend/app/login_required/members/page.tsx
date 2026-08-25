import Provider from '@/app/QueryClientProvider';
import Client from "./MemberClient"
import LoginRequiredHeader from '../LoginRequiredHeader';

const Page = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Provider>
        <LoginRequiredHeader />
        <Client/>
      </Provider>
    </div>
  )
}

export default Page