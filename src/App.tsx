import { AppRoutes } from './routes';

/**
 * Componente Principal App
 * Ele atua como o ponto de entrada visual, renderizando 
 * as rotas que definimos (Login ou Dashboard).
 */
function App() {
  return (
    // 'antialiased' deixa as fontes mais nítidas no navegador
    <div className="min-h-screen antialiased">
      <AppRoutes />
    </div>
  );
}

export default App;