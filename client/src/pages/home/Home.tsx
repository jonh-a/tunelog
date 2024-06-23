import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

interface Props {
  authenticated: boolean;
}

const Home: React.FC<Props> = ({
  authenticated
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) navigate('/login')
  }, [])

  return (
    <div>Home</div>
  )
}

export default Home