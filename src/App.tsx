import { Layout } from 'components/layout'
import './styles/index.css'
import { CustomReactFlow } from 'components/features/react-flow'
import { LoadingScreen } from 'components/shared/loading-screen'
import { WhaleWatcher } from 'components/shared/whale-watcher'

function App() {
  return (
    <WhaleWatcher>
      <LoadingScreen>
        <Layout>
          <CustomReactFlow />
        </Layout>
      </LoadingScreen>
    </WhaleWatcher>
  )
}

export default App
