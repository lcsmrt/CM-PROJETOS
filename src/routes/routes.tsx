import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Projetos from '../pages/projetos/Projetos'
import Revisoes from '../pages/revisoes/Revisoes'

export default function Roteador() {
  return (
    <Router>
      <Routes>
        <Route key='projetos' path='/' element={<Projetos />} />
        <Route key='projetos' path='/revisoes/:id' element={<Revisoes />} />
      </Routes>
    </Router>
  )
}