import { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
// ВАЖНО: Импортируем типы через 'import type' из-за verbatimModuleSyntax
import type { SolarService, CartItem } from './types';
import { SolarServiceList } from './pages/solar_service_list';
import { SolarServiceDetail } from './pages/solar_service_detail';
import { Cart } from './pages/solar_cart';
import { Breadcrumbs } from './components/solar_breadcrumbs';

type CurrentScreen = 'catalog' | 'detail' | 'cart';

function App() {
  const [screen, setScreen] = useState<CurrentScreen>('catalog');
  const [selectedItem, setSelectedItem] = useState<SolarService | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Логика добавления элемента в корзину
  const handleAddToCart = (solarService: SolarService) => {
    setCart(prev => {
      const match = prev.find(item => item.service.ID === solarService.ID);
      if (match) {
        return prev.map(item => 
          item.service.ID === solarService.ID 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { service: solarService, quantity: 1 }];
    });
  };

  const handleSelectItem = (item: SolarService) => {
    setSelectedItem(item);
    setScreen('detail');
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Описываем тип для крошек локально, чтобы избежать ошибок импорта TS2304
  type LocalCrumb = { label: string; onClick?: () => void };

  const buildBreadcrumbs = (): LocalCrumb[] => {
    const crumbs: LocalCrumb[] = [{ label: 'Каталог', onClick: () => setScreen('catalog') }];
    if (screen === 'detail' && selectedItem) {
      crumbs.push({ label: selectedItem.ModelName }); 
    } else if (screen === 'cart') {
      crumbs.push({ label: 'Корзина' });
    }
    return crumbs;
  };

  return (
    <>
      {/* Навигационная панель React-Bootstrap Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="#" onClick={() => setScreen('catalog')}>SolarEnergySystems</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link active={screen === 'catalog'} onClick={() => setScreen('catalog')}>Оборудование</Nav.Link>
              <Nav.Link active={screen === 'cart'} onClick={() => setScreen('cart')}>Корзина ({totalItemsInCart})</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {/* Самописная навигационная цепочка с переданными крошками */}
        <Breadcrumbs crumbs={buildBreadcrumbs()} />

        {/* Условный рендеринг (стейт-роутинг вместо полноценного Router) */}
        {screen === 'catalog' && (
          <SolarServiceList 
            onSelect={handleSelectItem} 
            onGoToCart={() => setScreen('cart')} 
            cartCount={totalItemsInCart} 
          />
        )}

        {screen === 'detail' && selectedItem && (
          <SolarServiceDetail 
            item={selectedItem} 
            onAddToCart={handleAddToCart} 
            onBack={() => setScreen('catalog')} 
          />
        )}

        {screen === 'cart' && (
          <Cart 
            cartItems={cart} 
            onBack={() => setScreen('catalog')} 
            onClear={() => setCart([])} 
          />
        )}
      </Container>
    </>
  );
}

export default App;
