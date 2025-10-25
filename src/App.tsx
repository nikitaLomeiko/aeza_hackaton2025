import { Layout } from 'components/layout'
import './styles/index.css'
import { CustomReactFlow } from 'components/features/react-flow'
import { useState } from 'react'
import { GitHubLoginModal } from 'components/features/react-flow/components/GitHubLoginModal'

function App() {
  const [isVisibeLogin, setIsViisbleLogin] = useState(false)

  return (
    <Layout>
      <GitHubLoginModal
        isOpen={isVisibeLogin}
        onClose={() => setIsViisbleLogin(false)}
        githubAuthUrl="http://localhost:8080/auth?provider=github"
      />
      <CustomReactFlow />
    </Layout>
  )
}

export default App
