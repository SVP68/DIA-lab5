import React, { useState, useMemo } from 'react';
import { Row, Col, Form, Card, Button, Badge } from 'react-bootstrap';
import type { SolarService } from '../types';
import { MOCK_SERVICES } from '../mock/solar_services';

const REAL_DEFAULT_IMAGE = "https://unsplash.com";

interface ListProps {
  onSelect: (item: SolarService) => void;
  onGoToCart: () => void;
  cartCount: number;
}

export const SolarServiceList: React.FC<ListProps> = ({ onSelect, onGoToCart, cartCount }) => {
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const filtered = useMemo(() => {
    return MOCK_SERVICES.filter(item => {
      // 1. Исключаем логически удаленные элементы (IsDeleted: true)
      if (item.IsDeleted === true) return false;

      // 2. Проверка по названию модели (приводим к регистронезависимому виду)
      const matchesSearch = item.ModelName.toLowerCase().includes(search.toLowerCase());

      // 3. Проверка по цене (если инпут пустой — пропускаем, иначе сравниваем числа)
      const matchesPrice = maxPrice === '' || item.Price <= parseFloat(maxPrice);

      // 4. Проверка по типу оборудования (если тип не выбран — пропускаем)
      const matchesType = selectedType === '' || item.Type === selectedType;

      // Карточка отобразится, только если прошли ВСЕ три фильтра
      return matchesSearch && matchesPrice && matchesType;
    });
  }, [search, maxPrice, selectedType]);

  const getImageUrl = (ImageKey: string | undefined) => {
    if (!ImageKey || ImageKey === "" || ImageKey.includes("unsplash.com")) {
      return REAL_DEFAULT_IMAGE;
    }
    return `/${ImageKey}`;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Каталог солнечного оборудования</h2>
        <Button variant="outline-success" onClick={onGoToCart} className="position-relative">
          🛒 Корзина {cartCount > 0 && <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">{cartCount}</Badge>}
        </Button>
      </div>

      <Form className="mb-4 p-3 bg-light rounded border shadow-sm">
        <Row>
          <Col md={4} className="mb-2">
            <Form.Group>
              <Form.Label>Название модели</Form.Label>
              <Form.Control type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-2">
            <Form.Group>
              <Form.Label>Макс. цена (₽)</Form.Label>
              <Form.Control type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="До..." />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-2">
            <Form.Group>
              <Form.Label>Тип оборудования</Form.Label>
              <Form.Select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="">Все категории</option>
                <option value="panel">Солнечные панели</option>
                <option value="battery">Аккумуляторы</option>
                <option value="inverter">Инверторы</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row>
        {filtered.map(item => (
          <Col key={item.ID} md={4} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img 
                variant="top" 
                src={getImageUrl(item.ImageKey)} 
                style={{ height: '180px', objectFit: 'cover' }} 
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-5">{item.ModelName}</Card.Title>
                <div className="mb-2">
                  <Badge bg="secondary" className="text-uppercase me-2">{item.Type}</Badge>
                  {item.Power > 0 && <Badge bg="info">Мощность: {item.Power} Вт</Badge>}
                  {item.Capacity > 0 && <Badge bg="dark">Емкость: {item.Capacity} Ач</Badge>}
                </div>
                <Card.Text className="text-muted flex-grow-1 small">
                  {item.Description.substring(0, 140)}...
                </Card.Text>
                <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-success fs-5">{item.Price.toLocaleString()} ₽</span>
                </div>
                <Button variant="primary" className="mt-3 w-100 fw-bold" onClick={() => onSelect(item)}>
                  Подробнее
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {filtered.length === 0 && (
          <Col className="text-center py-5 text-muted">Оборудования с такими фильтрами не найдено.</Col>
        )}
      </Row>
    </div>
  );
};